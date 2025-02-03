import React, { useState } from "react";

interface WalletInputProps {
  onWalletAddressChange: (address: string) => void;
}

const WalletInput: React.FC<WalletInputProps> = ({ onWalletAddressChange }) => {
  const [walletAddress, setWalletAddress] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const address = event.target.value;
    const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
    if (isValidAddress) {
      setWalletAddress(address);
      onWalletAddressChange(address);
    } else {
      console.error("Invalid wallet address format");
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={walletAddress}
        onChange={handleChange}
        placeholder="ウォレットアドレスを入力"
        className="p-2 border border-gray-300 rounded"
      />
    </div>
  );
};

export default WalletInput;
