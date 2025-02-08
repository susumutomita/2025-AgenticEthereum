"use client";
import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";

// ツイートの型
interface Tweet {
  id: string;
  text: string;
}

// Twitter APIレスポンスの型
interface TwitterResponse {
  data?: Tweet[];
  meta?: unknown;
  errors?: unknown;
}

interface TwitterFeedCardProps {
  unifiedCardClass?: string;
}

export function TwitterFeedCard({ unifiedCardClass }: TwitterFeedCardProps) {
  const [query, setQuery] = useState<string>("web3");
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 検索を実行する関数
  async function fetchTweets(searchTerm: string) {
    setLoading(true);
    setError(null);
    setTweets([]);
    try {
      const res = await fetch(
        `/api/twitter?query=${encodeURIComponent(searchTerm)}`,
      );
      if (!res.ok) {
        const errData = await res.json();
        const errMsg = errData.error || "Unknown error";
        setError(`Twitter API error: ${errMsg}`);
        console.error("Twitter API error detail:", errData.detail);
        return;
      }
      const data: TwitterResponse = await res.json();
      setTweets(data.data || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch tweets");
      }
    } finally {
      setLoading(false);
    }
  }

  // 初回レンダーで1回フェッチ
  useEffect(() => {
    fetchTweets(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card
      className={`
        flex flex-col h-full p-4
        bg-gray-800/50
        backdrop-blur-sm
        border-gray-700
        rounded-xl shadow-xl
        ${unifiedCardClass || ""}
      `}
    >
      {/* 検索結果一覧 (チャット風にスクロール) */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {loading && <p className="text-gray-500 text-sm mb-2">Loading...</p>}
        {/* ツイート表示 */}
        {tweets.length === 0 && !loading && !error ? (
          <p className="text-sm text-gray-500">No tweets found.</p>
        ) : (
          tweets.map((tweet) => (
            <div
              key={tweet.id}
              className="p-3 rounded-lg break-words bg-gray-700 text-white"
            >
              <p className="text-sm">{tweet.text}</p>
              <p className="text-xs text-gray-400 mt-1">ID: {tweet.id}</p>
            </div>
          ))
        )}
      </div>

      {/* 入力エリア (ドラッグ対象外にするため no-drag を付与) */}
      <div className="flex gap-2 mt-auto p-4 border-t border-gray-700 no-drag">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              fetchTweets(query);
            }
          }}
          className="flex-1 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white"
          placeholder="Enter a keyword"
          disabled={loading}
        />
        <button
          onClick={() => fetchTweets(query)}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </Card>
  );
}
