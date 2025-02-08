// app/DashboardPage.tsx (一例)
"use client";
import React, { useState, useEffect } from "react";
import { useWallet } from "../hooks/useWallet";
import { WalletConnectButton } from "../components/WalletConnectButton";
import { Card } from "../components/ui/card";
import { ChatInterface } from "../components/ChatInterface";

import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

// カードの基本スタイル
const unifiedCardClass =
  "p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl";

// レイアウト
const layouts = {
  lg: [
    { i: "chat", x: 0, y: 0, w: 6, h: 8, minH: 4 },
    { i: "wallet", x: 6, y: 0, w: 6, h: 6, minH: 3 },
    { i: "history", x: 6, y: 6, w: 6, h: 3, minH: 2 },
    { i: "twitter", x: 6, y: 9, w: 6, h: 3, minH: 2 },
  ],
  md: [
    { i: "chat", x: 0, y: 0, w: 6, h: 8, minH: 4 },
    { i: "wallet", x: 6, y: 0, w: 6, h: 6, minH: 3 },
    { i: "history", x: 6, y: 6, w: 6, h: 3, minH: 2 },
    { i: "twitter", x: 6, y: 9, w: 6, h: 3, minH: 2 },
  ],
  sm: [
    { i: "chat", x: 0, y: 0, w: 12, h: 6, minH: 4 },
    { i: "wallet", x: 0, y: 6, w: 12, h: 5, minH: 3 },
    { i: "history", x: 0, y: 11, w: 12, h: 4, minH: 3 },
    { i: "twitter", x: 0, y: 15, w: 12, h: 4, minH: 3 },
  ],
  xs: [
    { i: "chat", x: 0, y: 0, w: 12, h: 6, minH: 4 },
    { i: "wallet", x: 0, y: 6, w: 12, h: 5, minH: 3 },
    { i: "history", x: 0, y: 11, w: 12, h: 4, minH: 3 },
    { i: "twitter", x: 0, y: 15, w: 12, h: 4, minH: 3 },
  ],
};

export default function DashboardPage() {
  const { address, isConnected } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isConnected) {
    return (
      <main className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <Card className={unifiedCardClass}>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to CryptoDailyBrief
            </h2>
            <p className="mb-6">
              CryptoDailyBrief delivers daily crypto insights that empower
              investors to optimize portfolios, manage risks, and plan taxes.
            </p>
            <div className="inline-block p-1 border-2 border-white rounded">
              <WalletConnectButton />
            </div>
          </div>
        </Card>
      </main>
    );
  }

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="flex justify-between items-center mb-8 bg-gray-800/50 p-4 rounded-xl backdrop-blur-sm border border-gray-700 shadow-xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            CryptoDailyBrief Dashboard
          </h1>
          <WalletConnectButton />
        </header>

        <div className="w-full">
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
            cols={{ lg: 12, md: 12, sm: 12, xs: 12 }}
            rowHeight={40}
            margin={[16, 16]}
            containerPadding={[0, 0]}
            isDraggable={true}
            isResizable={true}
            compactType="vertical"
            preventCollision={false}
            autoSize={true}
            // ---ここがポイント---
            draggableCancel=".no-drag"
          >
            {/* チャットはドラッグ不可にしたい → divに .no-drag */}
            <div key="chat" className="h-full no-drag">
              <ChatInterface />
            </div>

            <Card key="wallet" className={unifiedCardClass}>
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
            </Card>

            <Card key="history" className={unifiedCardClass}>
              <h2 className="text-xl font-semibold mb-4">
                Transaction History
              </h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">No recent transactions.</p>
              </div>
            </Card>

            <Card key="twitter" className={unifiedCardClass}>
              <h2 className="text-xl font-semibold mb-4">Twitter Feed</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            </Card>
          </ResponsiveGridLayout>
        </div>
      </div>
    </main>
  );
}
