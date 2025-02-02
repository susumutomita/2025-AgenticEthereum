import Dashboard from "./components/Dashboard";
import WalletInput from "./components/WalletInput";
import { useState } from "react";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string>("");

  const handleWalletAddressChange = (address: string) => {
    setWalletAddress(address);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">ダッシュボード</h2>
      <WalletInput onWalletAddressChange={handleWalletAddressChange} />
      <Dashboard walletAddress={walletAddress} />
    </div>
  );
}
