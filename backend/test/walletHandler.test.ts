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
  beforeEach(() => {
    // Clear cache before each test
    Object.keys(cache).forEach((key) => delete cache[key]);
  });

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
    expect(response.body).toEqual({ success: true, data: mockData.data.wallet });
  });

  it("should return 404 if wallet not found", async () => {
    const mockData = { data: { wallet: null } };

    (axios.post as jest.Mock).mockResolvedValue({ data: mockData });

    const response = await request(app).get(
      "/api/wallet/0x1234567890abcdef1234567890abcdef12345678",
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ success: false, error: "Wallet not found" });
  });

  it("should return 500 if GRAPH_API_ENDPOINT is not defined", async () => {
    delete process.env.GRAPH_API_ENDPOINT;

    const response = await request(app).get(
      "/api/wallet/0x1234567890abcdef1234567890abcdef12345678",
    );

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ success: false, error: "GRAPH_API_ENDPOINT is not defined" });
  });

  it("should return cached data if available", async () => {
    const mockData = {
      balance: 100,
      transactions: [
        { id: "1", value: 50, timestamp: 1620000000 },
        { id: "2", value: 50, timestamp: 1620000001 },
      ],
    };

    const cache = { "0x1234567890abcdef1234567890abcdef12345678": { data: mockData, timestamp: Date.now() } };

    const response = await request(app).get(
      "/api/wallet/0x1234567890abcdef1234567890abcdef12345678",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: mockData });
  });

  it("should handle axios errors", async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const response = await request(app).get(
      "/api/wallet/0x1234567890abcdef1234567890abcdef12345678",
    );

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ success: false, error: "Error fetching wallet data" });
  });

  it("should log detailed error message for missing GRAPH_API_ENDPOINT", async () => {
    delete process.env.GRAPH_API_ENDPOINT;

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const response = await request(app).get(
      "/api/wallet/0x1234567890abcdef1234567890abcdef12345678",
    );

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ success: false, error: "GRAPH_API_ENDPOINT is not defined" });
    expect(consoleSpy).toHaveBeenCalledWith("GRAPH_API_ENDPOINT is not defined");

    consoleSpy.mockRestore();
  });

  it("should log detailed error message for axios errors", async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const response = await request(app).get(
      "/api/wallet/0x1234567890abcdef1234567890abcdef12345678",
    );

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ success: false, error: "Error fetching wallet data" });
    expect(consoleSpy).toHaveBeenCalledWith("Error fetching wallet data:", expect.any(Error));

    consoleSpy.mockRestore();
  });
});
