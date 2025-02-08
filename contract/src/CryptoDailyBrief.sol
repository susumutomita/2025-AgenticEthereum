// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "forge-std/console.sol"; // Foundry のデバッグ用

contract CryptoDailyBrief is ERC1155, Ownable {
    using Strings for uint256;

    uint256 public nextTokenId;
    mapping(uint256 => uint256) public stakeAmounts;
    mapping(uint256 => address) public stakeOwners;

    event Staked(address indexed user, uint256 tokenId, uint256 amount);
    event Unstaked(address indexed user, uint256 tokenId, uint256 amount);

    constructor() ERC1155("") Ownable(msg.sender) {}

    function stake() external payable {
        require(msg.value > 0, "Must send ETH to stake");

        uint256 tokenId = nextTokenId++;
        _mint(msg.sender, tokenId, 1, "");

        stakeAmounts[tokenId] = msg.value;
        stakeOwners[tokenId] = msg.sender;

        emit Staked(msg.sender, tokenId, msg.value);
    }

    function unstake(uint256 tokenId) external {
        // デバッグ出力
        console.log("unstake: caller", uint160(msg.sender));
        console.log("unstake: recorded owner", uint160(stakeOwners[tokenId]));
        console.log("unstake: contract balance", address(this).balance);
        console.log("unstake: stake amount", stakeAmounts[tokenId]);

        require(balanceOf(msg.sender, tokenId) > 0, "You do not own this NFT");
        require(stakeOwners[tokenId] == msg.sender, "Not the original staker");

        uint256 amount = stakeAmounts[tokenId];
        require(amount > 0, "No stake amount found");

        // ステーク情報をクリア
        stakeAmounts[tokenId] = 0;
        stakeOwners[tokenId] = address(0);

        _burn(msg.sender, tokenId, 1);
        payable(msg.sender).transfer(amount);

        emit Unstaked(msg.sender, tokenId, amount);
    }

    fallback() external payable {}
    receive() external payable {}

    function uri(uint256 tokenId) public view override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "https://susumutomita.github.io/2025-AgenticEthereum/metadata/",
                    tokenId.toString(),
                    ".json"
                )
            );
    }
}
