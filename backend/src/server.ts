import express, { Request, Response, RequestHandler } from "express";
import cors from "cors";
import axios from "axios";
import axiosRetry from "axios-retry";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(helmet());

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

interface Transaction {
  id: string;
  value: number;
  timestamp: number;
}

interface WalletData {
  balance: number;
  transactions: Transaction[];
}

const cache: { [key: string]: WalletData } = {};

const walletHandler: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
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

  if (!process.env.GRAPH_API_ENDPOINT) {
    res.status(500).json({ error: "GRAPH_API_ENDPOINT is not defined" });
    return;
  }

  if (cache[walletAddress]) {
    res.status(200).json(cache[walletAddress]);
    return;
  }

  try {
    const response = await axios.post(process.env.GRAPH_API_ENDPOINT, {
      query,
    });
    const { data } = response.data;
    if (!data || !data.wallet) {
      res.status(404).json({ error: "Wallet not found" });
      return;
    }
    const walletData: WalletData = {
      balance: data.wallet.balance,
      transactions: data.wallet.transactions,
    };
    cache[walletAddress] = walletData;
    res.status(200).json(walletData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching wallet data" });
  }
};

app.get("/api/wallet/:address", walletHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
