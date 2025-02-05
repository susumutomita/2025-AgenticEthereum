import { ethers } from "ethers";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendPath = path.resolve(__dirname, "../../backend");

const { aiService } = await import(
  path.join(backendPath, "src/services/aiService.js")
);
import type { UserContext } from "@backend/types/ai.js";

interface Config {
  provider: string;
  autonomeAddress: string;
  privateKey: string;
}

async function main() {
  try {
    console.log("Starting Autonome agent...");

    // 設定ファイルの読み込み
    const configPath = path.resolve(__dirname, "../autonome.config.json");
    const configContent = await fs.readFile(configPath, "utf-8");
    const config: Config = JSON.parse(configContent);

    // プロバイダーとウォレットの設定
    const provider = new ethers.JsonRpcProvider(config.provider);
    const wallet = new ethers.Wallet(config.privateKey, provider);

    // AIサービスの設定
    const context: UserContext = {
      wallet_address: wallet.address,
      risk_preference: "moderate",
      preferred_assets: ["ETH", "OLAS"],
      activity_history: [],
    };

    // メインループ
    while (true) {
      try {
        const response = await aiService.processMessage(
          "次のタスクは何ですか？",
          context,
        );
        console.log("AI Response:", response);

        // レスポンスをアクティビティ履歴に追加
        context.activity_history.push({
          action: "query_task",
          timestamp: new Date().toISOString(),
        });

        // 1分待機
        await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
      } catch (error) {
        console.error("Error in main loop:", error);
        // エラー時は30秒待機してリトライ
        await new Promise((resolve) => setTimeout(resolve, 30 * 1000));
      }
    }
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

main().catch(console.error);
