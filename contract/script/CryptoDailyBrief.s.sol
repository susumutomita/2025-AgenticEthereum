// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CryptoDailyBrief} from "../src/CryptoDailyBrief.sol";
import {CryptoDailyBriefIntegration} from "../src/CryptoDailyBriefIntegration.sol";

contract DeployCryptoDailyBriefScript is Script {
    function run() public {
        // .env などで OLAS_TOKEN の値を設定しておくこと
        address olasToken = vm.envAddress("OLAS_TOKEN");

        vm.startBroadcast();

        // CryptoDailyBrief コントラクトのデプロイ
        CryptoDailyBrief cryptoDailyBrief = new CryptoDailyBrief(olasToken);
        console.log("CryptoDailyBrief deployed at:", address(cryptoDailyBrief));

        // CryptoDailyBriefIntegration コントラクトのデプロイ
        // サービスレジストリとして CryptoDailyBrief のアドレスを渡す
        CryptoDailyBriefIntegration integration = new CryptoDailyBriefIntegration(address(cryptoDailyBrief), olasToken);
        console.log("CryptoDailyBriefIntegration deployed at:", address(integration));

        vm.stopBroadcast();
    }
}
