// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/CeloPolyGame.sol";
import "../src/CeloPolyTrophy.sol";
import "../src/CeloPolyLeaderboard.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address cUSDAddress = vm.envAddress("CUSD_ADDRESS"); // Load CUSD address from env

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Leaderboard
        CeloPolyLeaderboard leaderboard = new CeloPolyLeaderboard();
        console.log("CeloPolyLeaderboard deployed to:", address(leaderboard));

        // 2. Deploy Trophy NFT (needs game address, but game needs trophy address. Pass address(0) or deploy game after placeholder)
        // Wait, Trophy constructor needs gameContract to grant MINTER_ROLE. We can grant MINTER_ROLE after game is deployed!
        // To do this, we can deploy Trophy with a temporary game address, then change/grant MINTER_ROLE.
        // Let's deploy Trophy, deploy Game, then grant MINTER_ROLE to Game.
        CeloPolyTrophy trophy = new CeloPolyTrophy(address(0));
        console.log("CeloPolyTrophy deployed to:", address(trophy));

        // 3. Deploy Game
        CeloPolyGame game = new CeloPolyGame(cUSDAddress, address(trophy), address(leaderboard));
        console.log("CeloPolyGame deployed to:", address(game));

        // 4. Grant roles
        trophy.grantRole(trophy.MINTER_ROLE(), address(game));
        leaderboard.grantRole(leaderboard.RECORD_ROLE(), address(game));

        console.log("Roles successfully granted to CeloPolyGame contract!");

        vm.stopBroadcast();
    }
}
