// src/app/components/WalletBalanceCard.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { BrowserProvider, Contract, formatEther, formatUnits } from "ethers";

// ※ window.ethereum の型は global.d.ts にて定義済みとする

const TOKEN_ADDRESSES = {
  USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606EB48",
  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
};

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

interface WalletBalanceCardProps {
  address: string | null;
  unifiedCardClass?: string;
}

export function WalletBalanceCard({
  address,
  unifiedCardClass,
}: WalletBalanceCardProps) {
  const [ethBalance, setEthBalance] = useState("0.0");
  const [usdcBalance, setUsdcBalance] = useState("0.0");
  const [usdtBalance, setUsdtBalance] = useState("0.0");
  const [daiBalance, setDaiBalance] = useState("0.0");

  useEffect(() => {
    if (!address) return;
    if (!window.ethereum) return; // MetaMask 等が存在しない場合

    // EIP-1193 Provider を BrowserProvider でラップ
    const provider = new BrowserProvider(window.ethereum);

    const fetchBalances = async () => {
      try {
        // 1) ETH
        const rawEthBalance = await provider.getBalance(address);
        setEthBalance(formatEther(rawEthBalance));

        // 2) USDC
        const usdcContract = new Contract(
          TOKEN_ADDRESSES.USDC,
          ERC20_ABI,
          provider,
        );
        const usdcDecimals = await usdcContract.decimals();
        const usdcRaw = await usdcContract.balanceOf(address);
        setUsdcBalance(formatUnits(usdcRaw, usdcDecimals));

        // 3) USDT
        const usdtContract = new Contract(
          TOKEN_ADDRESSES.USDT,
          ERC20_ABI,
          provider,
        );
        const usdtDecimals = await usdtContract.decimals();
        const usdtRaw = await usdtContract.balanceOf(address);
        setUsdtBalance(formatUnits(usdtRaw, usdtDecimals));

        // 4) DAI
        const daiContract = new Contract(
          TOKEN_ADDRESSES.DAI,
          ERC20_ABI,
          provider,
        );
        const daiDecimals = await daiContract.decimals();
        const daiRaw = await daiContract.balanceOf(address);
        setDaiBalance(formatUnits(daiRaw, daiDecimals));
      } catch (err: unknown) {
        console.error("Error fetching balances:", err);
      }
    };

    fetchBalances();
  }, [address]);

  return (
    <Card className={unifiedCardClass}>
      <h2 className="text-xl font-semibold mb-4 text-blue-400">
        Wallet Balance
      </h2>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Address: {address ?? "No address"}
        </p>
        <div className="space-y-4">
          {/* ETH */}
          <div>
            <h3 className="text-md font-semibold mb-2">ETH</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Balance</p>
                <p className="text-lg font-bold">
                  {parseFloat(ethBalance).toFixed(4)} ETH
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">USD Equivalent</p>
                <p className="text-lg font-bold">$0.00</p>
              </div>
            </div>
          </div>

          {/* ERC20 Tokens */}
          <div>
            <h3 className="text-md font-semibold mb-2">ERC20 Tokens</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">USDC</p>
                <p className="text-lg font-bold">
                  {parseFloat(usdcBalance).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">USDT</p>
                <p className="text-lg font-bold">
                  {parseFloat(usdtBalance).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">DAI</p>
                <p className="text-lg font-bold">
                  {parseFloat(daiBalance).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
