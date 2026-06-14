// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Interfaces for Trophy and Leaderboard
interface ICeloPolyTrophy {
    function mintTrophy(address to, uint256 gameId) external returns (uint256);
}

interface ICeloPolyLeaderboard {
    function recordWin(address winner, uint256 prize) external;
}

contract CeloPolyGame is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ─── CONSTANTS ───────────────────────────────────────────────
    IERC20  public immutable cUSD;
    uint256 public constant  ENTRY_STAKE    = 1e18;      // 1 cUSD
    uint256 public constant  TURN_TIMEOUT   = 120;       // seconds
    uint8   public constant  BOARD_SIZE     = 40;
    uint8   public constant  GO_SALARY      = 200;       // cUSD equivalent (scaled separately)
    uint256 public constant  GO_SALARY_WEI  = 200 * 1e15; // 0.2 cUSD (scaled for playability)

    enum CellType {
        Go, Property, CommunityChest, Tax, Railroad, Chance, Jail, Utility, GoToJail, FreeParking
    }

    struct BoardCell {
        CellType cellType;
        int8     colorGroup;
        uint256  price;
        uint256  houseCost;
        uint256[6] rent;
    }

    BoardCell[40] public BOARD;

    // ─── STATE PACKING (gas-optimized) ───────────────────────────
    struct Player {
        address addr;
        uint128 balance;       // cUSD balance in game (in wei, 1e18 scale)
        uint8   position;      // board cell 0–39
        uint8   jailTurns;     // 0 = not in jail, 1–3 = jail countdown
        bool    bankrupt;
        bool    hasCommitted;  // for nonce commit
        bytes32 commitment;    // keccak256(nonce) for hybrid randomness
    }

    struct GameRoom {
        Player[4]   players;
        uint8       playerCount;
        uint8       currentTurn;        // index into players[]
        uint8       activePlayerCount;
        uint32[40]  propertyOwner;      // 0 = bank, 1–4 = player index
        uint8[40]   houseCount;         // 0–4 houses, 5 = hotel
        bool        started;
        bool        ended;
        uint256     lastActionTimestamp;
        uint128     totalPot;
    }

    // ─── STORAGE ─────────────────────────────────────────────────
    mapping(uint256 => GameRoom)  public games;
    mapping(address => uint256)   public activeGame;   // prevents joining 2 rooms
    uint256 public nextGameId = 1;

    // Trophy + Leaderboard contracts (set at deploy)
    address public trophyContract;
    address public leaderboardContract;

    // ─── EVENTS (frontend is 100% event-driven off these) ────────
    event GameCreated(uint256 indexed gameId, address indexed host);
    event PlayerJoined(uint256 indexed gameId, address indexed player, uint8 playerIndex);
    event GameStarted(uint256 indexed gameId, address[4] players);
    event NonceCommitted(uint256 indexed gameId, address indexed player, bytes32 commitment);
    event DiceRolled(uint256 indexed gameId, address indexed player, uint8 die1, uint8 die2, uint8 newPosition);
    event TurnChanged(uint256 indexed gameId, uint8 newTurnIndex, address nextPlayer);
    event PropertyBought(uint256 indexed gameId, uint8 cell, address indexed buyer, uint256 price);
    event RentPaid(uint256 indexed gameId, address indexed payer, address indexed receiver, uint256 amount, uint8 cell);
    event HouseBuilt(uint256 indexed gameId, uint8 cell, uint8 newHouseCount);
    event PlayerJailed(uint256 indexed gameId, address indexed player);
    event PlayerReleased(uint256 indexed gameId, address indexed player);
    event CardDrawn(uint256 indexed gameId, address indexed player, uint8 cardType, uint8 cardIndex, int128 cUSDEffect);
    event PlayerBankrupt(uint256 indexed gameId, address indexed player);
    event PlayerTimedOut(uint256 indexed gameId, address indexed player);
    event GameEnded(uint256 indexed gameId, address indexed winner, uint256 prize);

    // ─── CONSTRUCTOR ─────────────────────────────────────────────
    constructor(address _cUSD, address _trophy, address _leaderboard) Ownable(msg.sender) {
        cUSD = IERC20(_cUSD);
        trophyContract = _trophy;
        leaderboardContract = _leaderboard;
        _initializeBoard();
    }

    function _initializeBoard() internal {
        // Simple MVP Board Setup (Brown -> Dark Blue)
        // Set prices and baseline rents for properties
        BOARD[1] = BoardCell(CellType.Property, 0, 60e15, 50e15, [uint256(2e15), 10e15, 30e15, 90e15, 160e15, 250e15]);
        BOARD[3] = BoardCell(CellType.Property, 0, 60e15, 50e15, [uint256(4e15), 20e15, 60e15, 180e15, 320e15, 450e15]);
        
        BOARD[5] = BoardCell(CellType.Railroad, 8, 200e15, 0, [uint256(25e15), 50e15, 100e15, 200e15, 0, 0]);
        BOARD[6] = BoardCell(CellType.Property, 1, 100e15, 50e15, [uint256(6e15), 30e15, 90e15, 270e15, 400e15, 550e15]);
        BOARD[8] = BoardCell(CellType.Property, 1, 100e15, 50e15, [uint256(6e15), 30e15, 90e15, 270e15, 400e15, 550e15]);
        BOARD[9] = BoardCell(CellType.Property, 1, 120e15, 50e15, [uint256(8e15), 40e15, 100e15, 300e15, 450e15, 600e15]);

        BOARD[11] = BoardCell(CellType.Property, 2, 140e15, 100e15, [uint256(10e15), 50e15, 150e15, 450e15, 625e15, 750e15]);
        BOARD[12] = BoardCell(CellType.Utility, 9, 150e15, 0, [uint256(0), 0, 0, 0, 0, 0]);
        BOARD[13] = BoardCell(CellType.Property, 2, 140e15, 100e15, [uint256(10e15), 50e15, 150e15, 450e15, 625e15, 750e15]);
        BOARD[14] = BoardCell(CellType.Property, 2, 160e15, 100e15, [uint256(12e15), 60e15, 180e15, 500e15, 700e15, 900e15]);
        BOARD[15] = BoardCell(CellType.Railroad, 8, 200e15, 0, [uint256(25e15), 50e15, 100e15, 200e15, 0, 0]);

        BOARD[16] = BoardCell(CellType.Property, 3, 180e15, 100e15, [uint256(14e15), 70e15, 200e15, 550e15, 750e15, 950e15]);
        BOARD[18] = BoardCell(CellType.Property, 3, 180e15, 100e15, [uint256(14e15), 70e15, 200e15, 550e15, 750e15, 950e15]);
        BOARD[19] = BoardCell(CellType.Property, 3, 200e15, 100e15, [uint256(16e15), 80e15, 220e15, 600e15, 800e15, 1000e15]);

        BOARD[21] = BoardCell(CellType.Property, 4, 220e15, 150e15, [uint256(18e15), 90e15, 250e15, 700e15, 875e15, 1050e15]);
        BOARD[23] = BoardCell(CellType.Property, 4, 220e15, 150e15, [uint256(18e15), 90e15, 250e15, 700e15, 875e15, 1050e15]);
        BOARD[24] = BoardCell(CellType.Property, 4, 240e15, 150e15, [uint256(20e15), 100e15, 300e15, 750e15, 925e15, 1100e15]);
        BOARD[25] = BoardCell(CellType.Railroad, 8, 200e15, 0, [uint256(25e15), 50e15, 100e15, 200e15, 0, 0]);

        BOARD[26] = BoardCell(CellType.Property, 5, 260e15, 150e15, [uint256(22e15), 110e15, 330e15, 800e15, 975e15, 1150e15]);
        BOARD[28] = BoardCell(CellType.Property, 5, 260e15, 150e15, [uint256(22e15), 110e15, 330e15, 800e15, 975e15, 1150e15]);
        BOARD[29] = BoardCell(CellType.Property, 5, 280e15, 150e15, [uint256(24e15), 120e15, 360e15, 850e15, 1025e15, 1200e15]);

        BOARD[31] = BoardCell(CellType.Property, 6, 300e15, 200e15, [uint256(26e15), 130e15, 390e15, 900e15, 1100e15, 1275e15]);
        BOARD[32] = BoardCell(CellType.Property, 6, 300e15, 200e15, [uint256(26e15), 130e15, 390e15, 900e15, 1100e15, 1275e15]);
        BOARD[34] = BoardCell(CellType.Property, 6, 320e15, 200e15, [uint256(28e15), 150e15, 450e15, 1000e15, 1200e15, 1400e15]);
        BOARD[35] = BoardCell(CellType.Railroad, 8, 200e15, 0, [uint256(25e15), 50e15, 100e15, 200e15, 0, 0]);
        BOARD[36] = BoardCell(CellType.Utility, 9, 150e15, 0, [uint256(0), 0, 0, 0, 0, 0]);

        BOARD[37] = BoardCell(CellType.Property, 7, 350e15, 200e15, [uint256(35e15), 175e15, 500e15, 1100e15, 1300e15, 1500e15]);
        BOARD[38] = BoardCell(CellType.Tax, -1, 100e15, 0, [uint256(0), 0, 0, 0, 0, 0]);
        BOARD[39] = BoardCell(CellType.Property, 7, 400e15, 200e15, [uint256(50e15), 200e15, 600e15, 1400e15, 1700e15, 2000e15]);
    }

    // ─── GAME CREATION ───────────────────────────────────────────
    function createGame() external returns (uint256 gameId) {
        require(activeGame[msg.sender] == 0, "Already in a game");
        
        gameId = nextGameId++;
        GameRoom storage room = games[gameId];
        
        // Pull entry stake from player
        cUSD.safeTransferFrom(msg.sender, address(this), ENTRY_STAKE);
        
        room.players[0] = Player({
            addr: msg.sender,
            balance: uint128(GO_SALARY_WEI * 10), // Starting balance: 2000 cUSD equivalent
            position: 0,
            jailTurns: 0,
            bankrupt: false,
            hasCommitted: false,
            commitment: bytes32(0)
        });
        room.playerCount = 1;
        room.totalPot = uint128(ENTRY_STAKE);
        room.lastActionTimestamp = block.timestamp;
        activeGame[msg.sender] = gameId;
        
        emit GameCreated(gameId, msg.sender);
        emit PlayerJoined(gameId, msg.sender, 0);
    }

    function joinGame(uint256 gameId) external {
        require(activeGame[msg.sender] == 0, "Already in a game");
        GameRoom storage room = games[gameId];
        require(!room.started, "Game already started");
        require(room.playerCount < 4, "Room full");
        require(room.playerCount > 0, "Room does not exist");
        
        cUSD.safeTransferFrom(msg.sender, address(this), ENTRY_STAKE);
        
        uint8 idx = room.playerCount;
        room.players[idx] = Player({
            addr: msg.sender,
            balance: uint128(GO_SALARY_WEI * 10),
            position: 0,
            jailTurns: 0,
            bankrupt: false,
            hasCommitted: false,
            commitment: bytes32(0)
        });
        room.playerCount++;
        room.totalPot += uint128(ENTRY_STAKE);
        activeGame[msg.sender] = gameId;
        
        emit PlayerJoined(gameId, msg.sender, idx);
    }

    function startGame(uint256 gameId) external {
        GameRoom storage room = games[gameId];
        require(room.players[0].addr == msg.sender, "Only host can start");
        require(room.playerCount >= 2, "Need at least 2 players");
        require(!room.started, "Already started");
        
        room.started = true;
        room.activePlayerCount = room.playerCount;
        room.lastActionTimestamp = block.timestamp;
        
        address[4] memory addrs = [
            room.players[0].addr,
            room.players[1].addr,
            room.players[2].addr,
            room.players[3].addr
        ];
        emit GameStarted(gameId, addrs);
        emit TurnChanged(gameId, 0, room.players[0].addr);
    }

    // ─── HYBRID RANDOMNESS: COMMIT PHASE ─────────────────────────
    function commitNonce(uint256 gameId, bytes32 commitment) external {
        GameRoom storage room = games[gameId];
        uint8 idx = _getPlayerIndex(room, msg.sender);
        require(!room.players[idx].hasCommitted, "Already committed");
        room.players[idx].commitment = commitment;
        room.players[idx].hasCommitted = true;
        emit NonceCommitted(gameId, msg.sender, commitment);
    }

    // ─── ROLL DICE (single transaction per turn) ──────────────────
    function rollDice(uint256 gameId, uint256 revealedNonce) external nonReentrant {
        GameRoom storage room = games[gameId];
        require(room.started && !room.ended, "Game not active");
        
        uint8 idx = _getPlayerIndex(room, msg.sender);
        require(idx == room.currentTurn, "Not your turn");
        require(!room.players[idx].bankrupt, "You are bankrupt");
        
        require(
            keccak256(abi.encodePacked(revealedNonce)) == room.players[idx].commitment,
            "Invalid nonce"
        );
        
        uint256 seed = uint256(
            keccak256(abi.encodePacked(
                blockhash(block.number - 1),
                revealedNonce,
                room.currentTurn,
                block.timestamp,
                gameId
            ))
        );
        
        room.players[idx].commitment = keccak256(abi.encodePacked(seed));
        
        uint8 die1 = uint8(seed % 6) + 1;
        uint8 die2 = uint8((seed >> 8) % 6) + 1;
        uint8 roll  = die1 + die2;
        
        Player storage p = room.players[idx];
        
        if (p.jailTurns > 0) {
            if (die1 == die2) {
                p.jailTurns = 0;
                emit PlayerReleased(gameId, msg.sender);
            } else {
                p.jailTurns++;
                if (p.jailTurns > 3) {
                    uint128 bail = uint128(GO_SALARY_WEI / 4);
                    _deductBalance(gameId, idx, bail);
                    p.jailTurns = 0;
                    emit PlayerReleased(gameId, msg.sender);
                }
                _endTurn(gameId);
                return;
            }
        }
        
        uint8 oldPos = p.position;
        p.position = (oldPos + roll) % BOARD_SIZE;
        
        if (p.position < oldPos || (oldPos + roll >= BOARD_SIZE)) {
            p.balance += uint128(GO_SALARY_WEI);
        }
        
        emit DiceRolled(gameId, msg.sender, die1, die2, p.position);
        
        _executeLanding(gameId, idx, p.position, seed);
        
        if (die1 != die2) {
            _endTurn(gameId);
        }
        
        room.lastActionTimestamp = block.timestamp;
    }

    // ─── TIMEOUT MECHANISM ────────────────────────────────────────
    function claimTimeout(uint256 gameId) external {
        GameRoom storage room = games[gameId];
        require(room.started && !room.ended, "Game not active");
        require(block.timestamp > room.lastActionTimestamp + TURN_TIMEOUT, "Timeout not reached");
        
        uint8 timedOutIdx = room.currentTurn;
        address timedOut = room.players[timedOutIdx].addr;
        _declareBankruptcy(gameId, timedOutIdx);
        emit PlayerTimedOut(gameId, timedOut);
    }

    // ─── BUY PROPERTY ─────────────────────────────────────────────
    function buyProperty(uint256 gameId, uint8 cell) external nonReentrant {
        GameRoom storage room = games[gameId];
        require(room.started && !room.ended, "Game not active");
        uint8 idx = _getPlayerIndex(room, msg.sender);
        require(idx == room.currentTurn, "Not your turn");
        require(room.players[idx].position == cell, "Not on this cell");
        require(room.propertyOwner[cell] == 0, "Already owned");
        require(_isBuyableCell(cell), "Not a property");
        
        uint128 price = uint128(BOARD[cell].price);
        require(room.players[idx].balance >= price, "Insufficient balance");
        
        room.players[idx].balance -= price;
        room.propertyOwner[cell] = idx + 1; // 1-indexed so 0 = bank
        
        emit PropertyBought(gameId, cell, msg.sender, price);
    }

    // ─── BUILD HOUSE ──────────────────────────────────────────────
    function buildHouse(uint256 gameId, uint8 cell) external nonReentrant {
        GameRoom storage room = games[gameId];
        uint8 idx = _getPlayerIndex(room, msg.sender);
        require(room.propertyOwner[cell] == idx + 1, "You don't own this");
        require(room.houseCount[cell] < 5, "Already has hotel");
        require(_ownsColorGroup(room, idx, BOARD[cell].colorGroup), "Must own full group");
        
        uint128 houseCost = uint128(BOARD[cell].houseCost);
        require(room.players[idx].balance >= houseCost, "Insufficient balance");
        
        room.players[idx].balance -= houseCost;
        room.houseCount[cell]++;
        
        emit HouseBuilt(gameId, cell, room.houseCount[cell]);
    }

    function getGameRoom(uint256 gameId) external view returns (
        Player[4] memory players,
        uint8 playerCount,
        uint8 currentTurn,
        uint8 activePlayerCount,
        uint32[40] memory propertyOwner,
        uint8[40] memory houseCount,
        bool started,
        bool ended,
        uint256 lastActionTimestamp,
        uint128 totalPot
    ) {
        GameRoom storage room = games[gameId];
        return (
            room.players,
            room.playerCount,
            room.currentTurn,
            room.activePlayerCount,
            room.propertyOwner,
            room.houseCount,
            room.started,
            room.ended,
            room.lastActionTimestamp,
            room.totalPot
        );
    }

    // ─── INTERNAL HELPERS ─────────────────────────────────────────
    function _executeLanding(uint256 gameId, uint8 playerIdx, uint8 cell, uint256 seed) internal {
        GameRoom storage room = games[gameId];
        CellType ct = BOARD[cell].cellType;
        
        if (ct == CellType.Property || ct == CellType.Railroad || ct == CellType.Utility) {
            uint32 owner = room.propertyOwner[cell];
            if (owner != 0 && owner != playerIdx + 1) {
                uint8 ownerIdx = uint8(owner - 1);
                uint128 rent = _calculateRent(gameId, cell, ownerIdx, seed);
                _transferBalance(gameId, playerIdx, ownerIdx, rent, cell);
            }
        } else if (ct == CellType.GoToJail) {
            room.players[playerIdx].position = 10; // Jail cell
            room.players[playerIdx].jailTurns = 1;
            emit PlayerJailed(gameId, room.players[playerIdx].addr);
        } else if (ct == CellType.Chance) {
            uint8 cardIndex = uint8(seed % 16);
            _executeChanceCard(gameId, playerIdx, cardIndex, seed);
        } else if (ct == CellType.CommunityChest) {
            uint8 cardIndex = uint8(seed % 16);
            _executeCommunityCard(gameId, playerIdx, cardIndex, seed);
        } else if (ct == CellType.Tax) {
            uint128 tax = uint128(BOARD[cell].price); // price field used for tax amount
            _deductBalance(gameId, playerIdx, tax);
        }
    }

    function _endTurn(uint256 gameId) internal {
        GameRoom storage room = games[gameId];
        uint8 next = (room.currentTurn + 1) % room.playerCount;
        uint8 attempts = 0;
        while (room.players[next].bankrupt && attempts < 4) {
            next = (next + 1) % room.playerCount;
            attempts++;
        }
        room.currentTurn = next;
        room.lastActionTimestamp = block.timestamp;
        emit TurnChanged(gameId, next, room.players[next].addr);
    }

    function _transferBalance(uint256 gameId, uint8 from, uint8 to, uint128 amount, uint8 cell) internal {
        GameRoom storage room = games[gameId];
        if (room.players[from].balance < amount) {
            amount = room.players[from].balance;
            _declareBankruptcy(gameId, from);
        }
        room.players[from].balance -= amount;
        room.players[to].balance += amount;
        emit RentPaid(gameId, room.players[from].addr, room.players[to].addr, amount, cell);
    }

    function _deductBalance(uint256 gameId, uint8 playerIdx, uint128 amount) internal {
        GameRoom storage room = games[gameId];
        Player storage p = room.players[playerIdx];
        if (p.balance < amount) {
            _declareBankruptcy(gameId, playerIdx);
            return;
        }
        p.balance -= amount;
    }

    function _declareBankruptcy(uint256 gameId, uint8 playerIdx) internal {
        GameRoom storage room = games[gameId];
        room.players[playerIdx].bankrupt = true;
        room.activePlayerCount--;
        activeGame[room.players[playerIdx].addr] = 0;
        emit PlayerBankrupt(gameId, room.players[playerIdx].addr);
        
        if (room.activePlayerCount == 1) {
            _endGame(gameId);
        } else {
            _endTurn(gameId);
        }
    }

    function _endGame(uint256 gameId) internal {
        GameRoom storage room = games[gameId];
        room.ended = true;
        
        address winner;
        for (uint8 i = 0; i < room.playerCount; i++) {
            if (!room.players[i].bankrupt) {
                winner = room.players[i].addr;
                activeGame[winner] = 0;
                break;
            }
        }
        
        uint256 prize = room.totalPot;
        cUSD.safeTransfer(winner, prize);
        
        ICeloPolyTrophy(trophyContract).mintTrophy(winner, gameId);
        ICeloPolyLeaderboard(leaderboardContract).recordWin(winner, prize);
        
        emit GameEnded(gameId, winner, prize);
    }

    function _calculateRent(uint256 gameId, uint8 cell, uint8 ownerIdx, uint256 seed) internal view returns (uint128) {
        GameRoom storage room = games[gameId];
        uint8 houses = room.houseCount[cell];
        uint256[6] memory rents = BOARD[cell].rent;
        
        if (BOARD[cell].cellType == CellType.Railroad) {
            uint8 railroadsOwned = _countGroupOwned(room, ownerIdx, 8);
            return uint128(rents[railroadsOwned - 1]);
        }
        if (BOARD[cell].cellType == CellType.Utility) {
            uint8 utilsOwned = _countGroupOwned(room, ownerIdx, 9);
            uint8 roll = uint8(seed % 11) + 2;
            return uint128(roll) * (utilsOwned == 2 ? 10 : 4) * 1e15;
        }
        return uint128(rents[houses]);
    }

    function _getPlayerIndex(GameRoom storage room, address player) internal view returns (uint8) {
        for (uint8 i = 0; i < room.playerCount; i++) {
            if (room.players[i].addr == player) return i;
        }
        revert("Player not in game");
    }

    function _ownsColorGroup(GameRoom storage room, uint8 playerIdx, int8 group) internal view returns (bool) {
        uint8 count = 0;
        uint8 groupSize = 0;
        for (uint8 i = 0; i < BOARD_SIZE; i++) {
            if (BOARD[i].colorGroup == group && _isBuyableCell(i)) {
                groupSize++;
                if (room.propertyOwner[i] == playerIdx + 1) count++;
            }
        }
        return count == groupSize && groupSize > 0;
    }

    function _countGroupOwned(GameRoom storage room, uint8 playerIdx, int8 group) internal view returns (uint8 count) {
        for (uint8 i = 0; i < BOARD_SIZE; i++) {
            if (BOARD[i].colorGroup == group && room.propertyOwner[i] == playerIdx + 1) count++;
        }
    }

    function _isBuyableCell(uint8 cell) internal view returns (bool) {
        CellType ct = BOARD[cell].cellType;
        return ct == CellType.Property || ct == CellType.Railroad || ct == CellType.Utility;
    }

    function _executeChanceCard(uint256 gameId, uint8 playerIdx, uint8 cardIndex, uint256) internal {
        int128[16] memory effects = [
            int128(50e15),    // 0: Yield farming rewards
            int128(-100e15),  // 1: Flash loan exploit
            int128(150e15),   // 2: NFT sold for profit
            int128(-80e15),   // 3: Rug-pull loss
            int128(75e15),    // 4: Airdrop received
            int128(-60e15),   // 5: Missed tax deadline
            int128(200e15),   // 6: Early investor exit
            int128(-150e15),  // 7: Smart contract bug
            int128(40e15),    // 8: Staking rewards
            int128(-50e15),   // 9: USDC depeg loss
            int128(90e15),    // 10: Liquidity fee income
            int128(-200e15),  // 11: Market crash
            int128(120e15),   // 12: Grants programme
            int128(-40e15),   // 13: Hardware wallet damaged
            int128(55e15),    // 14: Arbitrage opportunity
            int128(30e15)     // 15: Bear market survival bonus
        ];
        
        int128 effect = effects[cardIndex];
        emit CardDrawn(gameId, games[gameId].players[playerIdx].addr, 0, cardIndex, effect);
        
        if (effect > 0) {
            games[gameId].players[playerIdx].balance += uint128(effect);
        } else {
            _deductBalance(gameId, playerIdx, uint128(-effect));
        }
    }

    function _executeCommunityCard(uint256 gameId, uint8 playerIdx, uint8 cardIndex, uint256) internal {
        int128[16] memory effects = [
            int128(50e15),    // 0: Web3 course bonus
            int128(-150e15),  // 1: Medical emergency
            int128(30e15),    // 2: Compound interest
            int128(75e15),    // 3: Salary negotiation
            int128(40e15),    // 4: Referral income
            int128(-50e15),   // 5: Subscription creep
            int128(200e15),   // 6: Inheritance
            int128(-85e15),   // 7: Unexpected repair
            int128(80e15),    // 8: Early invoice payment
            int128(45e15),    // 9: Content creation tips
            int128(-60e15),   // 10: BNPL fees
            int128(60e15),    // 11: Budget savings
            int128(110e15),   // 12: Open source crowdfund
            int128(-35e15),   // 13: Annual subscription
            int128(95e15),    // 14: Portfolio stability bonus
            int128(25e15)     // 15: Mentoring gift
        ];
        
        int128 effect = effects[cardIndex];
        emit CardDrawn(gameId, games[gameId].players[playerIdx].addr, 1, cardIndex, effect);
        
        if (effect > 0) {
            games[gameId].players[playerIdx].balance += uint128(effect);
        } else {
            _deductBalance(gameId, playerIdx, uint128(-effect));
        }
    }
}
