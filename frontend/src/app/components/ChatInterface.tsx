"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";

interface ChatMessage {
  role: string;
  content: string;
}

export function ChatInterface() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  // メッセージ一覧のコンテナを参照
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // メッセージが追加されるたびに自動スクロールで最下部へ
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setError(null);
    setLoading(true);

    // 送信前にユーザメッセージを履歴に追加
    const newHistory = [...chatHistory, { role: "user", content: message }];
    setChatHistory(newHistory);
    setMessage("");

    // 10秒タイムアウトの AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch("/api/v1/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          autonome: {
            baseUrl: process.env.NEXT_PUBLIC_AUTONOME_BASE_URL,
            instanceId: process.env.NEXT_PUBLIC_AUTONOME_INSTANCE_ID,
            username: process.env.NEXT_PUBLIC_AUTONOME_USERNAME,
            password: process.env.NEXT_PUBLIC_AUTONOME_PASSWORD,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId); // 成功/失敗にかかわらずタイマー解除

      if (!response.ok) {
        // サーバーから 200系以外のステータスが返れば、ここで throw
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      console.log("response data:", data);

      // ここでサーバーのレスポンス構造を要確認
      // 例: data.messageResult?.text が実際に含まれているか？
      const assistantMessage = data.messageResult?.text ?? JSON.stringify(data); // fallback: もし構造が違うならraw表示

      setChatHistory([
        ...newHistory,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (error: unknown) {
      console.error("Error sending message:", error);

      // タイムアウトかどうかをチェック
      if (error instanceof DOMException && error.name === "AbortError") {
        // fetch中断の場合
        setChatHistory([
          ...newHistory,
          {
            role: "assistant",
            content: "Request timed out. Please try again later.",
          },
        ]);
      } else {
        // その他のエラー
        setChatHistory([
          ...newHistory,
          {
            role: "assistant",
            content:
              "An error occurred. Please try again later or check server logs.",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full p-4 bg-gray-800/50 backdrop-blur-sm border-gray-700 rounded-xl shadow-xl">
      {/* チャットメッセージ一覧 */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4 space-y-4 p-4"
      >
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg break-words max-w-[80%] ${
              msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-700 text-white"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* 入力エリア */}
      <div className="flex gap-2 mt-auto p-4 border-t border-gray-700">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              sendMessage();
            }
          }}
          className="flex-1 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white"
          placeholder="Enter your message..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </Card>
  );
}
