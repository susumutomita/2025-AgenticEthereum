"use client";
import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { BrowserProvider, formatEther } from "ethers";

interface WalletBalanceCardProps {
  address: string | null;
  unifiedCardClass?: string;
}

export function WalletBalanceCard({
  address,
  unifiedCardClass,
}: WalletBalanceCardProps) {
  const [ethBalance, setEthBalance] = useState("0.0");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;
    if (!window.ethereum) return; // MetaMask などが存在しない場合

    const provider = new BrowserProvider(window.ethereum);

    const fetchBalances = async () => {
      try {
        // 1) ETH 残高取得
        const rawEthBalance = await provider.getBalance(address);
        setEthBalance(formatEther(rawEthBalance));

        // 2) ERC20 (USDC) のデバッグ用 - 一旦コメントアウト
        /*
        const usdcContract = new Contract(
          "0x5dEaC602762362FE5f135FA5904351916053cF70", // USDC
          ["function symbol() view returns (string)"], // symbol() を試す
          provider
        );
        const usdcSymbol = await usdcContract.symbol();
        console.log("USDC Symbol:", usdcSymbol);
        */
      } catch (err: unknown) {
        console.error("Error fetching balances:", err);
        setError("Failed to fetch balances. Check console for details.");
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

          {/* エラー表示 */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </Card>
  );
}
