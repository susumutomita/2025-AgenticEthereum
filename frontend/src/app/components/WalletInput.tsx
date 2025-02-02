import React, { useState } from "react";

interface WalletInputProps {
  onWalletAddressChange: (address: string) => void;
}

const WalletInput: React.FC<WalletInputProps> = ({ onWalletAddressChange }) => {
  const [walletAddress, setWalletAddress] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const address = event.target.value;
    setWalletAddress(address);
    onWalletAddressChange(address);
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
