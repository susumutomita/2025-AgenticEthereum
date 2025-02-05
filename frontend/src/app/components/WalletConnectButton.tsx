"use client";

import { useWallet } from "../hooks/useWallet";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export function WalletConnectButton() {
  const { connect, disconnect, isConnected, address, loading } = useWallet();

  const handleClick = async () => {
    if (isConnected) {
      disconnect();
    } else {
      await connect();
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={isConnected ? "secondary" : "default"}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : isConnected ? (
        <>
          <span className="font-mono text-sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  );
}
