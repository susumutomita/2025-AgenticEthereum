"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface Transaction {
  id: string;
  value: number;
  timestamp: number;
}

interface WalletData {
  wallet: {
    transactions: Transaction[];
    balance: number;
  };
}

export default function Dashboard() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  // サンプルのウォレットアドレス（実際はユーザー入力などで取得）
  const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";

  useEffect(() => {
    // バックエンドのAPIエンドポイントを呼び出す
    axios
      .get<WalletData>(`http://localhost:3001/api/wallet/${walletAddress}`)
      .then((response) => {
        setWalletData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching wallet data:", error);
      });
  }, [walletAddress]);

  // ダミーデータが取得できた場合にグラフ用のデータを準備
  const chartData = {
    labels: walletData
      ? walletData.wallet.transactions.map((tx) =>
          new Date(tx.timestamp * 1000).toLocaleDateString("ja-JP"),
        )
      : [],
    datasets: [
      {
        label: "取引額",
        data: walletData
          ? walletData.wallet.transactions.map((tx) => tx.value)
          : [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.2,
        fill: true,
      },
    ],
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-bold">
          現在のウォレット残高:{" "}
          {walletData ? walletData.wallet.balance : "Loading..."} ETH
        </h3>
      </div>
      <div>
        {walletData ? <Line data={chartData} /> : <p>データを取得中...</p>}
      </div>
    </div>
  );
}
