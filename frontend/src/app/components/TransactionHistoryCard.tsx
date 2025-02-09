// frontend/src/app/components/TransactionHistoryCard.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { request, gql } from "graphql-request";

// サブグラフのクエリエンドポイント
const SUBGRAPH_QUERY_URL =
  "https://api.studio.thegraph.com/query/103770/cryptodailybrief/v0.0.1";

// エンティティの型定義（GraphQL では BigInt は文字列で返る場合が多い）
interface StakedEntity {
  id: string;
  user: string;
  tokenId: string;
  amount: string;
  blockTimestamp: string;
}

// クエリレスポンスの型定義
interface StakedQueryResponse {
  stakeds: StakedEntity[];
}

export function TransactionHistoryCard({
  unifiedCardClass,
}: {
  unifiedCardClass?: string;
}) {
  const [transactions, setTransactions] = useState<StakedEntity[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const query = gql`
        {
          stakeds(first: 5, orderBy: blockTimestamp, orderDirection: desc) {
            id
            user
            tokenId
            amount
            blockTimestamp
          }
        }
      `;
      try {
        const data = await request<StakedQueryResponse>(
          SUBGRAPH_QUERY_URL,
          query,
        );
        setTransactions(data.stakeds);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <Card className={unifiedCardClass}>
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      <div className="space-y-2">
        {transactions.length === 0 ? (
          <p className="text-sm text-gray-500">No recent transactions.</p>
        ) : (
          <ul>
            {transactions.map((tx) => (
              <li key={tx.id}>
                {tx.user} - Token ID: {tx.tokenId} - Amount: {tx.amount} -
                Timestamp: {tx.blockTimestamp}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
