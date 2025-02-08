"use client";
import React, { useState, useEffect } from "react";
import { useWallet } from "../hooks/useWallet";
import { WalletConnectButton } from "../components/WalletConnectButton";
import { Card } from "../components/ui/card";
import { ChatInterface } from "../components/ChatInterface";
import { WalletBalanceCard } from "../components/WalletBalanceCard";
import { TransactionHistoryCard } from "../components/TransactionHistoryCard";
import { TwitterFeedCard } from "../components/TwitterFeedCard";

import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const unifiedCardClass =
  "p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl";

const layouts = {
  lg: [
    { i: "chat", x: 0, y: 0, w: 6, h: 9, minH: 4 }, // チャット 左
    { i: "wallet", x: 0, y: 0, w: 6, h: 6, minH: 3 }, // ウォレット 右上
    { i: "history", x: 6, y: 0, w: 6, h: 3, minH: 3 }, // 履歴 右中央
    { i: "twitter", x: 6, y: 3, w: 6, h: 3, minH: 3 }, // Twitter 右下
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
              CryptoDailyBrief delivers daily crypto insights...
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
            rowHeight={50} // 行の高さを調整
            margin={[10, 10]} // 隙間を均等に
            containerPadding={[10, 10]} // 余白調整
            isDraggable={true}
            isResizable={true}
            compactType={null} // 縦の詰めを無効化
            preventCollision={true} // 重なりを防止
            autoSize={false} // サイズの自動変更を無効化
            draggableCancel=".no-drag"
          >
            {/* 1) チャット */}
            <div key="chat" className="h-full no-drag">
              <ChatInterface />
            </div>

            {/* 2) ウォレット残高 */}
            <div key="wallet" className="h-full">
              <WalletBalanceCard
                address={address}
                unifiedCardClass={unifiedCardClass}
              />
            </div>

            {/* 3) 取引履歴 */}
            <div key="history" className="h-full">
              <TransactionHistoryCard unifiedCardClass={unifiedCardClass} />
            </div>

            {/* 4) Twitter */}
            <div key="twitter" className="h-full no-drag">
              <TwitterFeedCard unifiedCardClass={unifiedCardClass} />
            </div>
          </ResponsiveGridLayout>
        </div>
      </div>
    </main>
  );
}
