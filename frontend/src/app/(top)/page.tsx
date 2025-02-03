"use client";
import Dashboard from "../components/Dashboard";
import WalletInput from "../components/WalletInput";
import { useState } from "react";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string>("");

  const handleWalletAddressChange = (address: string) => {
    const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
    if (isValidAddress) {
      setWalletAddress(address);
    } else {
      console.error("Invalid wallet address format");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">ダッシュボード</h2>
      <WalletInput onWalletAddressChange={handleWalletAddressChange} />
      <Dashboard walletAddress={walletAddress} />
    </div>
  );
}
