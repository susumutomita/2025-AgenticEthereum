"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/server.ts
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/api/wallet/:address", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = yield axios_1.default.post("https://api.thegraph.com/subgraphs/name/your-subgraph", { query });
        res.json(response.data.data);
    }
    catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
