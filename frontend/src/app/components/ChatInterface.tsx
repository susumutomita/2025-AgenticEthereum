import { useState } from "react";
import { Card } from "./ui/card";

interface ChatMessage {
  role: string;
  content: string;
}

export function ChatInterface() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  // 状態の値は使わないので、無視するためにカンマを利用します
  const [, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setError(null);
    setLoading(true);
    const newHistory = [...chatHistory, { role: "user", content: message }];
    setChatHistory(newHistory);
    setMessage("");

    try {
      const response = await fetch("/api/v1/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          autonome: {
            baseUrl: process.env.NEXT_PUBLIC_AUTONOME_BASE_URL,
            instanceId: process.env.NEXT_PUBLIC_AUTONOME_INSTANCE_ID,
            username: process.env.NEXT_PUBLIC_AUTONOME_USERNAME,
            password: process.env.NEXT_PUBLIC_AUTONOME_PASSWORD,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      setChatHistory([
        ...newHistory,
        { role: "assistant", content: data.messageResult.text },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory([
        ...newHistory,
        {
          role: "assistant",
          content: "エラーが発生しました。もう一度お試しください。",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)] p-4 bg-gray-800/50 backdrop-blur-sm border-gray-700 rounded-xl shadow-xl">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-700 text-white"
            } max-w-[80%] break-words`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-auto p-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !loading && sendMessage()}
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="メッセージを入力..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "送信中..." : "送信"}
        </button>
      </div>
    </Card>
  );
}
