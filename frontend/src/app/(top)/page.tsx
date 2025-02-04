"use client";
import WalletConnectButton from "../components/wallet-connect-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const TopPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">Welcome to Agentic Ethereum</h1>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-3 lg:text-left gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your Ethereum wallet to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <WalletConnectButton />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analyze Your Portfolio</CardTitle>
            <CardDescription>
              Get insights into your crypto holdings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Connect your wallet to view portfolio analytics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optimize Your Strategy</CardTitle>
            <CardDescription>
              Receive personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>AI-powered suggestions for your portfolio</p>
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-5xl mt-12">
        <h2 className="text-2xl font-bold mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white/5 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-2">Portfolio Tracking</h3>
            <p>
              Real-time monitoring of your crypto assets and performance metrics
            </p>
          </div>
          <div className="p-6 bg-white/5 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-2">Smart Analytics</h3>
            <p>Advanced analysis tools to help you make informed decisions</p>
          </div>
          <div className="p-6 bg-white/5 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-2">AI Recommendations</h3>
            <p>
              Personalized suggestions based on market trends and your goals
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TopPage;
