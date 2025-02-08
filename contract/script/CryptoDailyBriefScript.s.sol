// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/CryptoDailyBrief.sol"; // コントラクトのパスを確認してください

contract CryptoDailyBriefScript is Script {
    function run() external {
        // スクリプト実行時に使用するプライベートキーでブロードキャスト開始
        vm.startBroadcast();
        CryptoDailyBrief nft = new CryptoDailyBrief();
        console.log("CryptoDailyBrief deployed at:", address(nft));
        vm.stopBroadcast();
    }
}
