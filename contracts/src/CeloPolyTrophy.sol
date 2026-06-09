// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CeloPolyTrophy is ERC721, AccessControl {
    using Strings for uint256;
    using Strings for address;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private _nextTokenId = 1;

    struct TrophyData {
        address winner;
        uint256 gameId;
        uint256 timestamp;
    }
    mapping(uint256 => TrophyData) public trophyData;

    constructor(address gameContract) ERC721("CeloPolY Trophy", "CPTRPHY") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, gameContract);
    }

    function mintTrophy(address to, uint256 gameId) external onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
        tokenId = _nextTokenId++;
        trophyData[tokenId] = TrophyData(to, gameId, block.timestamp);
        _safeMint(to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        TrophyData memory d = trophyData[tokenId];

        // On-chain SVG — no IPFS dependency
        string memory svg = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">',
            '<rect width="400" height="400" fill="#0D0F14"/>',
            '<rect x="20" y="20" width="360" height="360" fill="none" stroke="#FCCE47" stroke-width="2" rx="12"/>',
            '<text x="200" y="80" text-anchor="middle" font-family="monospace" font-size="48" fill="#FCCE47">*</text>',
            '<text x="200" y="130" text-anchor="middle" font-family="monospace" font-size="20" font-weight="bold" fill="#F0F2F8">CeloPolY Champion</text>',
            '<text x="200" y="165" text-anchor="middle" font-family="monospace" font-size="11" fill="#8892A4">Game #',
            d.gameId.toString(),
            '</text>',
            '<text x="200" y="200" text-anchor="middle" font-family="monospace" font-size="9" fill="#35D07F">',
            _toHexString(uint160(d.winner), 20),
            '</text>',
            '<text x="200" y="340" text-anchor="middle" font-family="monospace" font-size="10" fill="#8892A4">Own the block.</text>',
            '<text x="200" y="360" text-anchor="middle" font-family="monospace" font-size="10" fill="#8892A4">Learn the rules of money.</text>',
            '</svg>'
        ));

        string memory json = Base64.encode(bytes(string(abi.encodePacked(
            '{"name":"CeloPolY Trophy #', tokenId.toString(),
            '","description":"Awarded to the winner of CeloPolY Game #', d.gameId.toString(),
            '","image":"data:image/svg+xml;base64,', Base64.encode(bytes(svg)),
            '","attributes":[{"trait_type":"Game ID","value":"', d.gameId.toString(),
            '"},{"trait_type":"Winner","value":"', _toHexString(uint160(d.winner), 20),
            '"}]}'
        ))));

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function _toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = '0'; buffer[1] = 'x';
        for (uint256 i = 2 * length + 1; i > 1; i--) {
            buffer[i] = bytes1(uint8(48 + uint256(value & 0xf) + (uint256(value & 0xf) < 10 ? 0 : 39)));
            value >>= 4;
        }
        return string(buffer);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
