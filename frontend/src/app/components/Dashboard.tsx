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
  const [walletAddress, setWalletAddress] = useState<string>("");

  const handleWalletAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(event.target.value);
  };

  const handleFetchWalletData = () => {
    if (walletAddress) {
      axios
        .get<WalletData>(`http://localhost:3001/api/wallet/${walletAddress}`)
        .then((response) => {
          setWalletData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching wallet data:", error);
        });
    }
  };

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
        <input
          type="text"
          value={walletAddress}
          onChange={handleWalletAddressChange}
          placeholder="ウォレットアドレスを入力"
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleFetchWalletData}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          データ取得
        </button>
      </div>
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
