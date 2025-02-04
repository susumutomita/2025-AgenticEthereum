import { WalletData, WalletCache } from "./types/wallet.js";

// In-memory cache for wallet data
export const cache: WalletCache = {};

export const walletHandler = {
  generateDummyData(address: string): WalletData {
    // If we have cached data, return it
    if (cache[address]) {
      return cache[address];
    }

    const now = new Date();
    const data = {
      address,
      balance: "10.5",
      transactions: [
        {
          id: "1",
          type: "receive" as const,
          amount: "2.5",
          date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          type: "send" as const,
          amount: "1.0",
          date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          type: "receive" as const,
          amount: "3.0",
          date: now.toISOString(),
        },
      ],
    };

    // Cache the generated data
    cache[address] = data;
    return data;
  },

  getWalletData(address: string): WalletData {
    return this.generateDummyData(address);
  },

  clearCache() {
    Object.keys(cache).forEach((key) => {
      delete cache[key];
    });
  },
};
