"use client";

import { useState, useEffect } from "react";
import { useAutonome } from "../../hooks/useAutonome";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Loader2 } from "lucide-react";

const AUTONOME_ADDRESS = process.env.NEXT_PUBLIC_AUTONOME_ADDRESS || "";
const OLAS_ADDRESS = process.env.NEXT_PUBLIC_OLAS_ADDRESS || "";

export function AutonomeRegister() {
  const [stakeAmount, setStakeAmount] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [currentStake, setCurrentStake] = useState("0");
  const [olasBalance, setOlasBalance] = useState("0");
  const [isRegistered, setIsRegistered] = useState(false);

  const {
    stake,
    registerAgent,
    getStakeAmount,
    getOlasBalance,
    checkRegistration,
    loading,
    address,
    isConnected,
  } = useAutonome({
    autonomeAddress: AUTONOME_ADDRESS,
    olasAddress: OLAS_ADDRESS,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected || !address) return;
      try {
        const [stake, balance, registered] = await Promise.all([
          getStakeAmount(),
          getOlasBalance(),
          checkRegistration(),
        ]);
        setCurrentStake(stake);
        setOlasBalance(balance);
        setIsRegistered(registered);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchData();
  }, [isConnected, address, getStakeAmount, getOlasBalance, checkRegistration]);

  const handleStake = async () => {
    try {
      await stake(stakeAmount);
      const newStake = await getStakeAmount();
      setCurrentStake(newStake);
      setStakeAmount("");
    } catch (error) {
      console.error("Staking failed:", error);
      alert("Failed to stake: " + (error as Error).message);
    }
  };

  const handleRegister = async () => {
    try {
      await registerAgent(Number(serviceId));
      setIsRegistered(true);
      setServiceId("");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Failed to register: " + (error as Error).message);
    }
  };

  if (!isConnected) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-600">
          Please connect your wallet to use Autonome
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Agent Registration</h2>
        <p className="text-sm text-gray-600">
          Stake OLAS tokens and register as an agent
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-600">Current Stake</div>
          <div className="text-xl font-semibold">{currentStake} OLAS</div>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-600">OLAS Balance</div>
          <div className="text-xl font-semibold">{olasBalance} OLAS</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Stake Amount</label>
          <div className="flex space-x-2">
            <Input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Enter amount in OLAS"
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={handleStake}
              disabled={!stakeAmount || loading}
              className="w-24"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Stake"}
            </Button>
          </div>
        </div>

        {!isRegistered && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Service ID</label>
            <div className="flex space-x-2">
              <Input
                type="number"
                min="1"
                step="1"
                value={serviceId}
                onChange={(e) => {
                  const value = e.target.value;
                  if (Number(value) < 1) return;
                  setServiceId(value);
                }}
                placeholder="Enter service ID"
                disabled={loading}
                className="flex-1"
              />
              <Button
                onClick={handleRegister}
                disabled={!serviceId || loading}
                className="w-24"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Register"
                )}
              </Button>
            </div>
          </div>
        )}

        {isRegistered && (
          <div className="p-4 bg-green-50 text-green-700 rounded">
            ✓ Registered as agent
          </div>
        )}
      </div>
    </Card>
  );
}

export default AutonomeRegister;
