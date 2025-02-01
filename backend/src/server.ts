// backend/src/server.ts
import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/wallet/:address', async (req: Request, res: Response) => {
  const walletAddress = req.params.address.toLowerCase();
  const query = `
    {
      wallet(id: "${walletAddress}") {
        transactions {
          id
          value
          timestamp
        }
        balance
      }
    }
  `;
  try {
    const response = await axios.post('https://api.thegraph.com/subgraphs/name/your-subgraph', { query });
    res.json(response.data.data);
  } catch (error: any) {
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
