import { describe, expect, test } from "@jest/globals";
import { ethers } from "ethers";
import type { UserContext } from "../../backend/src/types/ai.js";

describe("Agent", () => {
  test("should create valid user context", () => {
    const wallet = ethers.Wallet.createRandom();
    const context: UserContext = {
      wallet_address: wallet.address,
      risk_preference: "moderate",
      preferred_assets: ["ETH", "OLAS"],
      activity_history: [],
    };

    expect(context.wallet_address).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(context.risk_preference).toBe("moderate");
    expect(context.preferred_assets).toContain("ETH");
    expect(context.preferred_assets).toContain("OLAS");
    expect(context.activity_history).toHaveLength(0);
  });
});
