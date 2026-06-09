// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CeloPolyLeaderboard is AccessControl {
    bytes32 public constant RECORD_ROLE = keccak256("RECORD_ROLE");

    struct Record {
        address player;
        uint256 totalWinnings;
        uint256 winsCount;
    }

    mapping(address => Record) public records;
    address[] public topPlayers;

    event RecordUpdated(address indexed player, uint256 totalWinnings, uint256 winsCount);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function recordWin(address winner, uint256 prize) external onlyRole(RECORD_ROLE) {
        Record storage r = records[winner];
        if (r.player == address(0)) {
            r.player = winner;
            topPlayers.push(winner);
        }
        r.totalWinnings += prize;
        r.winsCount += 1;

        emit RecordUpdated(winner, r.totalWinnings, r.winsCount);
    }

    function getTopPlayers() external view returns (address[] memory) {
        return topPlayers;
    }

    function getPlayerRecord(address player) external view returns (uint256, uint256) {
        Record memory r = records[player];
        return (r.totalWinnings, r.winsCount);
    }
}
