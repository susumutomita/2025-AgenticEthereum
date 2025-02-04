import express from "express";
import cors from "cors";
import { walletHandler } from "./walletHandler.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
