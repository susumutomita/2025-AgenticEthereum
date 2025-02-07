// backend/src/routes/restake.ts
import { Router, Request, Response } from "express";
import { fetchRestakeBalance } from "../services/restakeService.js";

const router = Router();

/**
 * GET /api/restake-balance?user=<ウォレットアドレス>
 * ユーザーアドレスをクエリパラメータ "user" で受け取り、リステーキング残高を返す
 */
router.get("/restake-balance", async (req: Request, res: Response) => {
  const userAddress = req.query.user as string;
  if (!userAddress) {
    return res
      .status(400)
      .json({ error: "ユーザーアドレスを指定してください" });
  }
  try {
    const balance = await fetchRestakeBalance(userAddress);
    res.json({ balance });
  } catch (error) {
    console.error("Error in /restake-balance route:", error);
    res.status(500).json({ error: "リステーキング残高の取得に失敗しました" });
  }
});

export default router;
