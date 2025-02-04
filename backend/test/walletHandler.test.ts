import { walletHandler, cache } from "../src/walletHandler.js";

describe("walletHandler", () => {
  beforeEach(() => {
    // Clear the cache before each test
    walletHandler.clearCache();
  });

  test("generates dummy data for a wallet address", () => {
    const address = "0x123";
    const data = walletHandler.getWalletData(address);

    expect(data).toEqual(
      expect.objectContaining({
        address: address,
        balance: expect.any(String),
        transactions: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            type: expect.stringMatching(/^(send|receive)$/),
            amount: expect.any(String),
            date: expect.any(String),
          }),
        ]),
      }),
    );
  });

  test("caches wallet data", () => {
    const address = "0x123";
    const firstCall = walletHandler.getWalletData(address);
    const secondCall = walletHandler.getWalletData(address);

    expect(secondCall).toBe(firstCall);
    expect(cache[address]).toBe(firstCall);
  });

  test("clearCache removes all cached data", () => {
    const address = "0x123";
    walletHandler.getWalletData(address);
    expect(cache[address]).toBeDefined();

    walletHandler.clearCache();
    expect(cache[address]).toBeUndefined();
  });
});
