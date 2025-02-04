"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

const WalletConnectButton = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to use this feature.");
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request<string[]>({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request<string[]>({
            method: "eth_accounts",
          });
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
    };

    checkConnection();

    // Set up event listeners
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: unknown) => {
        const ethAccounts = accounts as string[];
        if (ethAccounts.length === 0) {
          setIsConnected(false);
          setAddress(null);
        } else {
          setAddress(ethAccounts[0]);
          setIsConnected(true);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {
          console.log("Removed account listener");
        });
      }
    };
  }, []);

  return (
    <Button onClick={connectWallet} variant="outline" className="min-w-[200px]">
      {isConnected
        ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}`
        : "Connect Wallet"}
    </Button>
  );
};

export default WalletConnectButton;
