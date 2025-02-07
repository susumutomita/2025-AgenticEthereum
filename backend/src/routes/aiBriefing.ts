// backend/src/routes/aiBriefing.ts
import { Router, Request, Response } from "express";
import { aiService } from "../services/aiService.js";
import { UserContext } from "../types/ai.js"; // 追加：UserContext 型のインポート

const router = Router();

/**
 * GET /api/ai/briefing?address=<ウォレットアドレス>
 * クエリパラメータ "address" をもとに、AIブリーフィングを生成して返す
 */
router.get("/ai/briefing", async (req: Request, res: Response) => {
  const address = req.query.address as string;
  if (!address) {
    return res.status(400).json({ error: "ウォレットアドレスが必要です" });
  }

  try {
    // UserContext 型を明示的に指定して作成する
    const userContext: UserContext = {
      wallet_address: address,
      risk_preference: "moderate", // "moderate" はリテラル型として扱われる
      preferred_assets: ["ETH"],
      activity_history: [],
    };
    const briefing = await aiService.getDailyBriefing(address, userContext);
    res.json(briefing);
  } catch (error) {
    console.error("Error generating daily briefing:", error);
    res.status(500).json({ error: "日次ブリーフィングの生成に失敗しました" });
  }
});

export default router;
