import request from "supertest";
import express, { Request, Response } from "express";
import axios from "axios";
import axiosRetry from "axios-retry";
import { walletHandler } from "../src/server";

const app = express();
app.use(express.json());
app.get("/api/wallet/:address", walletHandler);

jest.mock("axios");
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

describe("GET /api/wallet/:address", () => {
  it("should return wallet data", async () => {
    const mockData = {
      data: {
        wallet: {
          balance: 100,
          transactions: [
            { id: "1", value: 50, timestamp: 1620000000 },
            { id: "2", value: 50, timestamp: 1620000001 },
          ],
        },
      },
    };

    (axios.post as jest.Mock).mockResolvedValue({ data: mockData });

    const response = await request(app).get(
      "/api/wallet/0x1234567890abcdef1234567890abcdef12345678",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData.data.wallet);
  });

  it("should return 404 if wallet not found", async () => {
    const mockData = { data: { wallet: null } };

    (axios.post as jest.Mock).mockResolvedValue({ data: mockData });

    const response = await request(app).get(
      "/api/wallet/0x1234567890abcdef1234567890abcdef12345678",
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Wallet not found" });
  });

  it("should return 500 if GRAPH_API_ENDPOINT is not defined", async () => {
    delete process.env.GRAPH_API_ENDPOINT;

    const response = await request(app).get(
      "/api/wallet/0x1234567890abcdef1234567890abcdef12345678",
    );

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "GRAPH_API_ENDPOINT is not defined" });
  });

  it("should return cached data if available", async () => {
    const mockData = {
      balance: 100,
      transactions: [
        { id: "1", value: 50, timestamp: 1620000000 },
        { id: "2", value: 50, timestamp: 1620000001 },
      ],
    };

    const cache = { "0x1234567890abcdef1234567890abcdef12345678": mockData };

    const response = await request(app).get(
      "/api/wallet/0x1234567890abcdef1234567890abcdef12345678",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  it("should handle axios errors", async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const response = await request(app).get(
      "/api/wallet/0x1234567890abcdef1234567890abcdef12345678",
    );

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Error fetching wallet data" });
  });
});
