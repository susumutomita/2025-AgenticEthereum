"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { WalletData, Transaction } from "../../types/wallet";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const DashboardPage = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const address = "dummy-address";
        const response = await axios.get<WalletData>(
          `${API_URL}/api/wallet/${address}`,
        );
        setWalletData(response.data);
      } catch (error) {
        console.error("Error fetching wallet data", error);
      }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: walletData
      ? walletData.transactions.map((tx: Transaction) => tx.date)
      : [],
    datasets: [
      {
        label: "Transaction Amount (ETH)",
        data: walletData
          ? walletData.transactions.map((tx: Transaction) =>
              parseFloat(tx.amount),
            )
          : [],
        fill: false,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,0.2)",
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {walletData ? (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-4 shadow">
            <p>
              <strong>Wallet Address:</strong> {walletData.address}
            </p>
            <p>
              <strong>Balance:</strong> {walletData.balance} ETH
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold mb-4">Transactions</h2>
            <ul className="space-y-2">
              {walletData.transactions.map((tx: Transaction) => (
                <li key={tx.id} className="border-b pb-2">
                  <div className="flex justify-between">
                    <span
                      className={
                        tx.type === "receive"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {tx.type === "receive" ? "↓" : "↑"} {tx.amount} ETH
                    </span>
                    <span className="text-gray-500">{tx.date}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold mb-4">Transaction Chart</h2>
            <Line data={chartData} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
