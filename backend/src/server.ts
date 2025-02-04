import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { walletHandler } from "./walletHandler.js";
import { createTelegramBot } from "./services/telegramService.js";
import { aiService } from "./services/aiService.js";
import cron from "node-cron";
import "./types/env.js";

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
      // 非 null アサーションで walletAddress が必ず存在することを示す
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

// API Routes
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

app.post("/api/notification/settings", (req, res) => {
  // const { chatId, enabled, time } = req.body;
  // TODO: Implement notification settings
  res.json({ success: true });
});

// Health check endpoint
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

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    // next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  },
);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
