// frontend/src/app/dashboard/page.tsx
"use client";

import { useState } from "react";
import { useWallet } from "../../hooks/useWallet";
import { WalletConnectButton } from "../../components/WalletConnectButton";
import { Card } from "../../components/ui/card";

interface DailyBriefing {
  type: "action" | "warning" | "information";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  reasoning: string[];
  data_sources: {
    type: "market" | "social" | "wallet";
    key_points: string[];
  }[];
  timestamp: string;
}

export default function DashboardPage() {
  const { address, isConnected } = useWallet();
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // AI ブリーフィング API を呼び出す関数
  const fetchDailyBriefing = async () => {
    if (!address) {
      setError("ウォレットが接続されていません");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/ai/briefing?address=${address}`);
      if (!res.ok) {
        throw new Error("AI ブリーフィングの取得に失敗しました");
      }
      const data: DailyBriefing = await res.json();
      setBriefing(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "不明なエラーが発生しました",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-6 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">CryptoDailyBrief Dashboard</h1>
        <WalletConnectButton />
      </header>

      {!isConnected ? (
        <Card className="p-6">
          <div className="text-center">
            <p>ウォレットを接続してください。</p>
            <WalletConnectButton />
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-semibold">AI ブリーフィング</h2>
            <p className="text-gray-600">
              ボタンを押して、最新の AI ブリーフィングを取得してください。
            </p>
            <button
              onClick={fetchDailyBriefing}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "読み込み中..." : "ブリーフィングを取得"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
            {briefing && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-xl font-bold">{briefing.title}</h3>
                <p className="mt-2">{briefing.description}</p>
                <div className="mt-4">
                  <h4 className="font-semibold">分析結果</h4>
                  <ul className="list-disc ml-5">
                    {briefing.reasoning.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold">データソース</h4>
                  {briefing.data_sources.map((ds, index) => (
                    <div key={index} className="mt-2">
                      <p className="font-bold">{ds.type.toUpperCase()}</p>
                      <ul className="list-disc ml-5">
                        {ds.key_points.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  {new Date(briefing.timestamp).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </main>
  );
}
