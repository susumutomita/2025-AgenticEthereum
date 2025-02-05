import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { walletHandler } from "./walletHandler.js";
import { createTelegramBot } from "./services/telegramService.js";
import { aiService } from "./services/aiService.js";
import cron from "node-cron";
import { autonomeService } from "./services/autonomeService.js";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Telegram bot
if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN environment variable is required");
}
const telegramBot = createTelegramBot(process.env.TELEGRAM_BOT_TOKEN);

// Schedule daily briefing generation
cron.schedule("0 8 * * *", async () => {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error("TELEGRAM_BOT_TOKEN is required for sending briefings");
    }
    const users = await telegramBot.getAllConnectedUsers();
    for (const user of users) {
      // 非 null アサーションで walletAddress の存在を保証
      const briefing = await aiService.getDailyBriefing(
        user.walletAddress!,
        user.userContext,
      );
      await telegramBot.sendBriefing(user.chatId, briefing);
      console.log(`Successfully sent briefing to user ${user.chatId}`);
    }
    console.log(
      `Daily briefing task completed. Sent briefings to ${users.length} users`,
    );
  } catch (error) {
    console.error("Error generating daily briefings:", error);
  }
});

// ----------------------
// API Endpoints
// ----------------------

// 1. Wallet Data取得エンドポイント
app.get("/api/wallet/:address", (req, res) => {
  const { address } = req.params;
  try {
    const walletData = walletHandler.getWalletData(address);
    res.json(walletData);
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    res.status(500).json({ error: "Failed to fetch wallet data" });
  }
});

// 2. 通知設定エンドポイント（将来的な実装用）
app.post("/api/notification/settings", (req, res) => {
  // TODO: Implement notification settings
  res.json({ success: true });
});

// 3. Autonomeへメッセージ送信エンドポイント
/**
 * リクエストボディ例:
 * {
 *   "text": "hi",
 *   "agentId": "（任意、指定しない場合は最初のagentを使用）"
 * }
 */
app.post("/api/autonome/message", async (req, res) => {
  const { text, agentId } = req.body;
  if (!text) {
    return res.status(400).json({ error: "textフィールドは必須です" });
  }
  try {
    // agentIdが指定されていない場合は自動的に最初のagentのIDを取得
    const finalAgentId = agentId || (await autonomeService.getAgentId());
    await autonomeService.sendMessage(finalAgentId, text);
    res.json({ success: true, agentId: finalAgentId });
  } catch (error) {
    console.error("Error in /api/autonome/message:", error);
    res.status(500).json({ error: "Autonomeへのメッセージ送信に失敗しました" });
  }
});

// 4. Health Checkエンドポイント
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    version: "1.0.0",
    services: {
      telegram: Boolean(telegramBot),
      api: true,
    },
  });
});

// ----------------------
// エラーハンドリングミドルウェア
// ----------------------
app.use((err: Error, req: express.Request, res: express.Response) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
