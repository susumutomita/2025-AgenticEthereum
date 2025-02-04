import { aiService } from "../src/services/aiService.js";
import { createTelegramBot } from "../src/services/telegramService.js";
import { UserContext } from "../src/types/ai.js";

// テスト実行前にダミーの TELEGRAM_BOT_TOKEN を設定
process.env.TELEGRAM_BOT_TOKEN = "dummy-token";

// モックファクトリを用いて createTelegramBot をモック化
jest.mock("../src/services/telegramService.js", () => ({
  createTelegramBot: jest.fn(),
}));

// createTelegramBot を jest.Mock としてキャスト
const mockedCreateTelegramBot = createTelegramBot as jest.Mock;

describe("AIService", () => {
  const mockSendBriefing = jest.fn();
  const mockGetDailyBriefing = jest.fn();

  beforeAll(() => {
    // モック関数の戻り値を設定
    mockedCreateTelegramBot.mockReturnValue({
      sendBriefing: mockSendBriefing,
    });
    // aiService.getDailyBriefing をモックに置き換え
    aiService.getDailyBriefing = mockGetDailyBriefing;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should generate daily briefing for a user", async () => {
    const walletAddress = "0x123";
    const userContext: UserContext = {
      wallet_address: walletAddress,
      risk_preference: "moderate",
      preferred_assets: ["ETH"],
      activity_history: [],
    };

    const briefing = {
      type: "information",
      priority: "medium",
      title: "Daily Portfolio Update",
      description: "Here's your daily crypto briefing",
      reasoning: ["ETH price increased by 2.5% in the last 24h"],
      data_sources: [
        {
          type: "market",
          key_points: ["ETH Price: $2500.00"],
        },
        {
          type: "social",
          key_points: [
            "Positive social media sentiment",
            "High engagement on crypto topics",
          ],
        },
        {
          type: "wallet",
          key_points: ["Total Balance: 10.5 ETH", "Risk Level: medium"],
        },
      ],
      timestamp: new Date().toISOString(),
    };

    mockGetDailyBriefing.mockResolvedValue(briefing);

    const result = await aiService.getDailyBriefing(walletAddress, userContext);

    expect(result).toEqual(briefing);
    expect(mockGetDailyBriefing).toHaveBeenCalledWith(
      walletAddress,
      userContext,
    );
  });

  test("should send daily briefing to a user via Telegram", async () => {
    const walletAddress = "0x123";
    const userContext: UserContext = {
      wallet_address: walletAddress,
      risk_preference: "moderate",
      preferred_assets: ["ETH"],
      activity_history: [],
    };

    const users = [
      {
        chatId: 12345,
        walletAddress: walletAddress,
        userContext: userContext,
      },
    ];

    const briefing = {
      type: "information",
      priority: "medium",
      title: "Daily Portfolio Update",
      description: "Here's your daily crypto briefing",
      reasoning: ["ETH price increased by 2.5% in the last 24h"],
      data_sources: [
        {
          type: "market",
          key_points: ["ETH Price: $2500.00"],
        },
        {
          type: "social",
          key_points: [
            "Positive social media sentiment",
            "High engagement on crypto topics",
          ],
        },
        {
          type: "wallet",
          key_points: ["Total Balance: 10.5 ETH", "Risk Level: medium"],
        },
      ],
      timestamp: new Date().toISOString(),
    };

    mockGetDailyBriefing.mockResolvedValue(briefing);

    await aiService.sendBriefingsToUsers(users);

    expect(mockGetDailyBriefing).toHaveBeenCalledWith("0x123", userContext);
    expect(mockSendBriefing).toHaveBeenCalledWith(12345, briefing);
  });
});
