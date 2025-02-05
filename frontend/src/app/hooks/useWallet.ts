interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (eventName: string, listener: (...args: unknown[]) => void) => void;
  removeListener: (
    eventName: string,
    listener: (...args: unknown[]) => void,
  ) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

import { useState, useEffect } from "react";
import { ethers } from "ethers";

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  loading: boolean;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    provider: null,
    signer: null,
    loading: false,
  });

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window === "undefined" || !window.ethereum) return;

      try {
        setState((prev) => ({ ...prev, loading: true }));
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();

        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const network = await provider.getNetwork();
          const expectedChainId = process.env.NEXT_PUBLIC_CHAIN_ID;
          if (
            expectedChainId &&
            Number(network.chainId) !== Number(expectedChainId)
          ) {
            try {
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                  { chainId: `0x${Number(expectedChainId).toString(16)}` },
                ],
              });
            } catch (_switchError) {
              console.error("Failed to switch network:", _switchError);
              throw new Error(
                `Please switch to the correct network (Chain ID: ${expectedChainId})`,
              );
            }
          }
          setState({
            address: accounts[0].address,
            isConnected: true,
            chainId: Number(network.chainId),
            provider,
            signer,
            loading: false,
          });
        } else {
          setState((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Failed to check wallet connection:", error);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    checkConnection();

    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", checkConnection);
      window.ethereum.on("chainChanged", checkConnection);
    }

    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeListener("accountsChanged", checkConnection);
        window.ethereum.removeListener("chainChanged", checkConnection);
      }
    };
  }, []);

  const connect = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    try {
      setState((prev) => ({ ...prev, loading: true }));
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await provider.listAccounts();
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      setState({
        address: accounts[0].address,
        isConnected: true,
        chainId: Number(network.chainId),
        provider,
        signer,
        loading: false,
      });

      return accounts[0].address;
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  };

  const disconnect = () => {
    setState({
      address: null,
      isConnected: false,
      chainId: null,
      provider: null,
      signer: null,
      loading: false,
    });
  };

  return {
    ...state,
    connect,
    disconnect,
  };
}
