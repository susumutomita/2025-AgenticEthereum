import { useState, useCallback } from "react";
import { AutonomeContract } from "../lib/contracts/autonome";
import { useWallet } from "./useWallet";

interface UseAutonomeOptions {
  autonomeAddress: string;
  olasAddress: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export function useAutonome({
  autonomeAddress,
  olasAddress,
}: UseAutonomeOptions) {
  const { signer, provider, address, isConnected } = useWallet();
  const [loading, setLoading] = useState(false);

  const getContract = useCallback(() => {
    if (!isConnected || !provider || !signer) {
      throw new Error("Wallet not connected");
    }
    return new AutonomeContract(autonomeAddress, olasAddress, signer);
  }, [autonomeAddress, olasAddress, provider, signer, isConnected]);

  const stake = async (amount: string) => {
    setLoading(true);
    try {
      const contract = getContract();
      const tx = await contract.stake(amount);
      await tx.wait();
    } finally {
      setLoading(false);
    }
  };

  const registerAgent = async (serviceId: number) => {
    setLoading(true);
    try {
      const contract = getContract();
      const tx = await contract.registerAgent(serviceId);
      await tx.wait();
    } finally {
      setLoading(false);
    }
  };

  const deregisterAgent = async () => {
    setLoading(true);
    try {
      const contract = getContract();
      const tx = await contract.deregisterAgent();
      await tx.wait();
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async (): Promise<Service[]> => {
    if (!provider) throw new Error("Provider not available");

    const contract = new AutonomeContract(
      autonomeAddress,
      olasAddress,
      provider,
    );
    const count = await contract.getServiceCount();
    const services: Service[] = [];

    for (let i = 1; i <= Number(count); i++) {
      const [name, description, active] = await contract.getService(i);
      services.push({
        id: i,
        name,
        description,
        active,
      });
    }

    return services;
  };

  const checkRegistration = async (userAddress: string = address!) => {
    if (!provider) throw new Error("Provider not available");

    const contract = new AutonomeContract(
      autonomeAddress,
      olasAddress,
      provider,
    );
    return contract.isAgentRegistered(userAddress);
  };

  const getStakeAmount = async (userAddress: string = address!) => {
    if (!provider) throw new Error("Provider not available");

    const contract = new AutonomeContract(
      autonomeAddress,
      olasAddress,
      provider,
    );
    const stake = await contract.getStake(userAddress);
    return stake.toString();
  };

  const getOlasBalance = async (userAddress: string = address!) => {
    if (!provider) throw new Error("Provider not available");

    const contract = new AutonomeContract(
      autonomeAddress,
      olasAddress,
      provider,
    );
    return contract.getOlasBalance(userAddress);
  };

  return {
    stake,
    registerAgent,
    deregisterAgent,
    fetchServices,
    checkRegistration,
    getStakeAmount,
    getOlasBalance,
    loading,
    isConnected,
    address,
  };
}
