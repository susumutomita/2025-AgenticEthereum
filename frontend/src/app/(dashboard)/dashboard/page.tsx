"use client";
import React from "react";
import { useWallet } from "../../hooks/useWallet";
import { WalletConnectButton } from "../../components/WalletConnectButton";
import { Card } from "../../components/ui/card";
import { ChatInterface } from "../../components/ChatInterface";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export default function DashboardPage() {
  const { address, isConnected } = useWallet();

  // If the wallet is not connected, show a prompt to connect
  if (!isConnected) {
    return (
      <main className="container mx-auto p-6 min-h-screen">
        <Card className="p-6">
          <div className="text-center">
            <p>Please connect your wallet.</p>
            <WalletConnectButton />
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="flex justify-between items-center mb-8 bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            CryptoDailyBrief Dashboard
          </h1>
          <WalletConnectButton />
        </header>

        <div className="w-full h-[calc(100vh-120px)]">
          <GridLayout
            className="layout"
            layout={[
              { i: "chat", x: 0, y: 0, w: 6, h: 8 },
              { i: "wallet", x: 6, y: 0, w: 6, h: 4 },
              { i: "history", x: 6, y: 4, w: 6, h: 4 },
              { i: "twitter", x: 0, y: 8, w: 12, h: 4 },
            ]}
            cols={12}
            rowHeight={30}
            width={1200}
            isDraggable={true} // Correct prop name: "isDraggable" instead of "draggable"
            isResizable={true} // Correct prop name: "isResizable" instead of "resizable"
          >
            <div key="chat" className="h-full">
              <ChatInterface />
            </div>

            <Card
              key="wallet"
              className="h-full p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700 rounded-xl shadow-xl overflow-auto"
            >
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                Wallet Balance
              </h2>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Address: {address}</p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-semibold mb-2">ETH</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Balance</p>
                        <p className="text-lg font-bold">0.0 ETH</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">USD Equivalent</p>
                        <p className="text-lg font-bold">$0.00</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-semibold mb-2">ERC20 Tokens</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">USDC</p>
                          <p className="text-lg font-bold">0.0</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">USDT</p>
                          <p className="text-lg font-bold">0.0</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">DAI</p>
                          <p className="text-lg font-bold">0.0</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card
              key="history"
              className="h-full p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700 rounded-xl shadow-xl overflow-auto"
            >
              <h2 className="text-xl font-semibold mb-4">
                Transaction History
              </h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">No recent transactions.</p>
              </div>
            </Card>

            <Card
              key="twitter"
              className="h-full p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700 rounded-xl shadow-xl overflow-auto"
            >
              <h2 className="text-xl font-semibold mb-4">Twitter Feed</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            </Card>
          </GridLayout>
        </div>
      </div>
    </main>
  );
}
