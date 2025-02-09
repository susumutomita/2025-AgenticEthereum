"use client";
import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
}

interface YouTubeFeedCardProps {
  unifiedCardClass?: string;
}

export function YouTubeFeedCard({ unifiedCardClass }: YouTubeFeedCardProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("web3"); // 初期は "web3" を設定

  async function fetchVideos(searchTerm: string) {
    setLoading(true);
    setError(null);
    setVideos([]);
    try {
      const res = await fetch(
        `/api/youtube?query=${encodeURIComponent(searchTerm)}`,
      );
      if (!res.ok) {
        const errData = await res.json();
        const errMsg = errData.error || "Unknown error";
        setError(`YouTube API error: ${errMsg}`);
        console.error("YouTube API error detail:", errData.detail);
        return;
      }
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch videos");
      }
    } finally {
      setLoading(false);
    }
  }

  // 初回のみ検索を実行するため、queryを依存配列に含めずに処理を実施
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchVideos(query);
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
      {/* キーワード入力エリア */}
      <div className="flex gap-2 mt-2 mb-2 p-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              fetchVideos(query);
            }
          }}
          placeholder="Enter keyword (e.g., web3)"
          className="flex-1 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white"
        />
        <button
          onClick={() => fetchVideos(query)}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* 動画表示エリア */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
        {error && (
          <p key="error" className="text-red-500 text-sm mb-2">
            {error}
          </p>
        )}
        {loading && (
          <p key="loading" className="text-gray-500 text-sm mb-2">
            Loading...
          </p>
        )}
        {videos.length === 0 && !loading && !error ? (
          <p key="no-videos" className="text-sm text-gray-500">
            No videos found.
          </p>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="flex flex-col items-center">
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <p className="text-sm mt-2">{video.title}</p>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => fetchVideos(query)}
        disabled={loading}
        className="mt-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Refreshing..." : "Refresh Videos"}
      </button>
    </Card>
  );
}
