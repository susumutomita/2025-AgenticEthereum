"use client";

import { WalletConnectButton } from "../components/WalletConnectButton";
import { Card } from "../components/ui/card";
import { useRouter } from "next/navigation";

export default function TopPage() {
  const router = useRouter();

  const handleConnect = () => {
    router.push("/dashboard");
  };

  return (
    <main className="container mx-auto p-6 min-h-screen">
      <div className="flex flex-col items-center justify-center space-y-8 mt-20">
        <h1 className="text-4xl font-bold text-center">
          Welcome to CryptoDailyBrief
        </h1>

        <p className="text-xl text-gray-600 text-center max-w-2xl">
          Daily Personalized Crypto Insights
        </p>

        <Card className="p-8 w-full max-w-lg">
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-semibold">Get Started</h2>
            <p className="text-gray-600">
              Connect your wallet to start using the platform
            </p>
            <WalletConnectButton onConnect={handleConnect} />
          </div>
        </Card>
      </div>
    </main>
  );
}
