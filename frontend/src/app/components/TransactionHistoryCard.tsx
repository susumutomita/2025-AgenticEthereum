"use client";
import React from "react";
import { Card } from "./ui/card";

interface TransactionHistoryCardProps {
  unifiedCardClass?: string;
}

export function TransactionHistoryCard({
  unifiedCardClass,
}: TransactionHistoryCardProps) {
  return (
    <Card className={unifiedCardClass}>
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      <div className="space-y-2">
        <p className="text-sm text-gray-500">No recent transactions.</p>
      </div>
    </Card>
  );
}
