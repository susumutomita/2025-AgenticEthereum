// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/CryptoDailyBrief.sol"; // コントラクトのパスを確認してください

contract CryptoDailyBriefTest is Test {
    CryptoDailyBrief public nft;
    // address(1) は precompile なので、代わりに address(0x100) を使用
    address public user = address(0x100);

    function setUp() public {
        nft = new CryptoDailyBrief();
        // テスト用に user に十分なETHを付与
        vm.deal(user, 10 ether);
    }

    function testStake() public {
        uint256 stakeAmount = 1 ether;
        // user のコンテキストで stake() を呼ぶ
        vm.prank(user);
        nft.stake{value: stakeAmount}();

        // 初回は tokenId = 0 になるはず
        uint256 tokenId = 0;
        // NFT の保有数が 1 であることを確認
        assertEq(nft.balanceOf(user, tokenId), 1, "NFT balance should be 1");
        // stakeAmounts に正しい金額が保存されているかチェック
        uint256 storedStake = nft.stakeAmounts(tokenId);
        assertEq(storedStake, stakeAmount, "Stake amount mismatch");
    }

    function testUnstake() public {
        uint256 stakeAmount = 1 ether;
        vm.prank(user);
        nft.stake{value: stakeAmount}();

        uint256 tokenId = 0;
        // unstake 前に user の残高を記録
        uint256 userBalanceBefore = user.balance;
        // unstake を実行
        vm.prank(user);
        nft.unstake(tokenId);

        // NFT がバーンされ、balance が 0 になるはず
        assertEq(nft.balanceOf(user, tokenId), 0, "NFT should be burned");
        // stakeAmounts が 0 にリセットされているかチェック
        assertEq(nft.stakeAmounts(tokenId), 0, "Stake amount should be zero after unstake");

        // ユーザーに返金されているか確認（ガスコストはあるため、許容誤差を設定）
        uint256 userBalanceAfter = user.balance;
        assertApproxEqAbs(userBalanceAfter, userBalanceBefore + stakeAmount, 1e15, "Unstaked amount mismatch");
    }
}
