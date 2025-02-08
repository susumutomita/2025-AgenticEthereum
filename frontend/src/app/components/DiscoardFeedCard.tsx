"use client";
import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";

interface DiscordMessage {
  id: string;
  content: string;
  author?: {
    id: string;
    username: string;
  };
}

export function DiscordFeedCard() {
  const [channelId, setChannelId] = useState("123456789012345678"); // 適当な初期値
  const [messages, setMessages] = useState<DiscordMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchMessages() {
    setLoading(true);
    setError(null);
    setMessages([]);
    try {
      const res = await fetch(
        `/api/discord?channel=${encodeURIComponent(channelId)}`,
      );
      if (!res.ok) {
        const errData = await res.json();
        setError(`Discord API error: ${errData.error || "Unknown"}`);
        console.error("Detail:", errData.detail);
        return;
      }
      const data = await res.json();
      setMessages(data.data || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch messages");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="p-4 bg-gray-800 text-white">
      <h2 className="text-xl font-semibold mb-4">Discord Channel Feed</h2>

      <div className="mb-4 flex items-center gap-2">
        <input
          className="border p-2 bg-gray-900 text-white"
          type="text"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 rounded"
          onClick={fetchMessages}
        >
          Fetch
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-2">
        {messages.length === 0 && !loading ? (
          <p className="text-sm text-gray-400">No messages found.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="border rounded p-2 bg-gray-700">
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs text-gray-400">
                {msg.author?.username} (ID: {msg.author?.id})
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
