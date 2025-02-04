import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { walletHandler } from "./walletHandler.js";
import { createTelegramBot } from "./services/telegramService.js";
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
    next: express.NextFunction,
  ) => {
    console.log("next :", next);
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
