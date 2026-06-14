export const CUSD_ALFAJORES = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1' as const
export const CUSD_MAINNET   = '0x765DE816845861e75A25fCA122bb6898B8B1282a' as const

export const GAME_CONTRACT_ALFAJORES = '0x0000000000000000000000000000000000000000' as const
export const GAME_CONTRACT_MAINNET   = '0x435b1d5b1be17d21850949d38b463bb2c357e814' as const

export const ENTRY_STAKE = 1000000000000000000n
export const GO_SALARY_WEI = 200000000000000000n

export const CHAIN_ID_MAINNET = 42220
export const CHAIN_ID_ALFAJORES = 44787

export function getCUSDAddress(chainId: number): `0x${string}` {
  return chainId === CHAIN_ID_MAINNET ? CUSD_MAINNET : CUSD_ALFAJORES
}

export function getGameAddress(chainId: number): `0x${string}` {
  return chainId === CHAIN_ID_MAINNET ? GAME_CONTRACT_MAINNET : GAME_CONTRACT_ALFAJORES
}

export const GAME_ABI = [
  {
    type: 'function',
    name: 'cUSD',
    inputs: [],
    outputs: [{ type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'ENTRY_STAKE',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'TURN_TIMEOUT',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nextGameId',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'games',
    inputs: [{ type: 'uint256' }],
    outputs: [
      { type: 'uint8', name: 'playerCount' },
      { type: 'uint8', name: 'currentTurn' },
      { type: 'uint8', name: 'activePlayerCount' },
      { type: 'bool', name: 'started' },
      { type: 'bool', name: 'ended' },
      { type: 'uint256', name: 'lastActionTimestamp' },
      { type: 'uint128', name: 'totalPot' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'activeGame',
    inputs: [{ type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'createGame',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'joinGame',
    inputs: [{ type: 'uint256', name: 'gameId' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'startGame',
    inputs: [{ type: 'uint256', name: 'gameId' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'commitNonce',
    inputs: [
      { type: 'uint256', name: 'gameId' },
      { type: 'bytes32', name: 'commitment' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'rollDice',
    inputs: [
      { type: 'uint256', name: 'gameId' },
      { type: 'uint256', name: 'revealedNonce' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'buyProperty',
    inputs: [
      { type: 'uint256', name: 'gameId' },
      { type: 'uint8', name: 'cell' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'buildHouse',
    inputs: [
      { type: 'uint256', name: 'gameId' },
      { type: 'uint8', name: 'cell' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claimTimeout',
    inputs: [{ type: 'uint256', name: 'gameId' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'BOARD',
    inputs: [{ type: 'uint8' }],
    outputs: [
      { type: 'uint8', name: 'cellType' },
      { type: 'int8', name: 'colorGroup' },
      { type: 'uint256', name: 'price' },
      { type: 'uint256', name: 'houseCost' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'GameCreated',
    inputs: [
      { type: 'uint256', indexed: true, name: 'gameId' },
      { type: 'address', indexed: true, name: 'host' },
    ],
  },
  {
    type: 'event',
    name: 'PlayerJoined',
    inputs: [
      { type: 'uint256', indexed: true, name: 'gameId' },
      { type: 'address', indexed: true, name: 'player' },
      { type: 'uint8', indexed: false, name: 'playerIndex' },
    ],
  },
  {
    type: 'event',
    name: 'GameStarted',
    inputs: [
      { type: 'uint256', indexed: true, name: 'gameId' },
      { type: 'address[4]', indexed: false, name: 'players' },
    ],
  },
  {
    type: 'event',
    name: 'DiceRolled',
    inputs: [
      { type: 'uint256', indexed: true, name: 'gameId' },
      { type: 'address', indexed: true, name: 'player' },
      { type: 'uint8', indexed: false, name: 'die1' },
      { type: 'uint8', indexed: false, name: 'die2' },
      { type: 'uint8', indexed: false, name: 'newPosition' },
    ],
  },
  {
    type: 'event',
    name: 'TurnChanged',
    inputs: [
      { type: 'uint256', indexed: true, name: 'gameId' },
      { type: 'uint8', indexed: false, name: 'newTurnIndex' },
      { type: 'address', indexed: false, name: 'nextPlayer' },
    ],
  },
  {
    type: 'event',
    name: 'PropertyBought',
    inputs: [
      { type: 'uint256', indexed: true, name: 'gameId' },
      { type: 'uint8', indexed: false, name: 'cell' },
      { type: 'address', indexed: true, name: 'buyer' },
      { type: 'uint256', indexed: false, name: 'price' },
    ],
  },
  {
    type: 'event',
    name: 'RentPaid',
    inputs: [
      { type: 'uint256', indexed: true, name: 'gameId' },
      { type: 'address', indexed: true, name: 'payer' },
      { type: 'address', indexed: true, name: 'receiver' },
      { type: 'uint256', indexed: false, name: 'amount' },
      { type: 'uint8', indexed: false, name: 'cell' },
    ],
  },
  {
    type: 'event',
    name: 'PlayerBankrupt',
    inputs: [
      { type: 'uint256', indexed: true, name: 'gameId' },
      { type: 'address', indexed: true, name: 'player' },
    ],
  },
  {
    type: 'event',
    name: 'GameEnded',
    inputs: [
      { type: 'uint256', indexed: true, name: 'gameId' },
      { type: 'address', indexed: true, name: 'winner' },
      { type: 'uint256', indexed: false, name: 'prize' },
    ],
  },
  {
    type: 'event',
    name: 'HouseBuilt',
    inputs: [
      { type: 'uint256', indexed: true, name: 'gameId' },
      { type: 'uint8', indexed: false, name: 'cell' },
      { type: 'uint8', indexed: false, name: 'newHouseCount' },
    ],
  },
  {
    type: 'event',
    name: 'PlayerJailed',
    inputs: [
      { type: 'uint256', indexed: true, name: 'gameId' },
      { type: 'address', indexed: true, name: 'player' },
    ],
  },
  {
    type: 'event',
    name: 'PlayerReleased',
    inputs: [
      { type: 'uint256', indexed: true, name: 'gameId' },
      { type: 'address', indexed: true, name: 'player' },
    ],
  },
  {
    type: 'event',
    name: 'CardDrawn',
    inputs: [
      { type: 'uint256', indexed: true, name: 'gameId' },
      { type: 'address', indexed: true, name: 'player' },
      { type: 'uint8', indexed: false, name: 'cardType' },
      { type: 'uint8', indexed: false, name: 'cardIndex' },
      { type: 'int128', indexed: false, name: 'cUSDEffect' },
    ],
  },
  {
    type: 'event',
    name: 'NonceCommitted',
    inputs: [
      { type: 'uint256', indexed: true, name: 'gameId' },
      { type: 'address', indexed: true, name: 'player' },
      { type: 'bytes32', indexed: false, name: 'commitment' },
    ],
  },
  {
    type: 'event',
    name: 'PlayerTimedOut',
    inputs: [
      { type: 'uint256', indexed: true, name: 'gameId' },
      { type: 'address', indexed: true, name: 'player' },
    ],
  },
] as const

export const CUSD_ABI = [
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { type: 'address', name: 'spender' },
      { type: 'uint256', name: 'amount' },
    ],
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { type: 'address', name: 'owner' },
      { type: 'address', name: 'spender' },
    ],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
] as const
