"use client";

import { Card } from "../../components/ui/card";
import { WalletConnectButton } from "../../components/WalletConnectButton";
import { AutonomeRegister } from "../../features/autonome/autonome-register";
import { AutonomeServices } from "../../features/autonome/autonome-services";
import { useWallet } from "../../hooks/useWallet";

export default function DashboardPage() {
  const { isConnected } = useWallet();

  return (
    <main className="container mx-auto p-6 min-h-screen">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Agentic Ethereum Dashboard</h1>
          <WalletConnectButton />
        </div>

        {/* Content */}
        {!isConnected ? (
          <Card className="p-6">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Welcome to Agentic Ethereum
              </h2>
              <p className="text-gray-600 mb-6">
                Connect your wallet to start using the platform
              </p>
              <WalletConnectButton />
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <AutonomeRegister />
            </div>
            <div className="space-y-6">
              <AutonomeServices />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
