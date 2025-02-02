import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/wallet/:address", async (req: Request, res: Response) => {
  const walletAddress = req.params.address.toLowerCase();
  const query = `
    {
      wallet(id: "${walletAddress}") {
        balance
        transactions {
          id
          value
          timestamp
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      process.env.GRAPH_API_ENDPOINT,
      { query }
    );
    const { data } = response.data;
    if (!data || !data.wallet) {
      return res.status(404).json({ error: "Wallet data not found" });
    }
    res.json(data);
  } catch (error) {
    console.error("Error fetching data from The Graph API:", error);
    res.status(500).json({ error: "Failed to fetch wallet data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
