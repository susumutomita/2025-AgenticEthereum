import TelegramBot from "node-telegram-bot-api";
import { TelegramUserState, BOT_MESSAGES } from "../types/telegram.js";
import { AIRecommendation } from "../types/ai.js";
import type { UserContext } from "../types/ai.js";

type RiskLevel = UserContext["risk_preference"];
const RISK_MAP: Record<string, RiskLevel> = {
  "1": "conservative",
  "2": "moderate",
  "3": "aggressive",
};

class TelegramService {
  private bot: TelegramBot;
  private userStates: Map<number, TelegramUserState> = new Map();

  constructor(token: string) {
    this.bot = new TelegramBot(token, { polling: true });
    this.setupCommandHandlers();
  }

  private setupCommandHandlers(): void {
    // Start コマンド
    this.bot.onText(/\/start/, (msg) => {
      this.handleStart(msg.chat.id);
    });

    // Help コマンド
    this.bot.onText(/\/help/, (msg) => {
      this.sendMessage(msg.chat.id, BOT_MESSAGES.help);
    });

    // Connect wallet コマンド
    this.bot.onText(/\/connect/, (msg) => {
      this.handleConnect(msg.chat.id);
    });

    // Brief コマンド
    this.bot.onText(/\/brief/, async (msg) => {
      await this.handleBrief(msg.chat.id);
    });

    // Settings コマンド
    this.bot.onText(/\/settings/, (msg) => {
      this.handleSettings(msg.chat.id);
    });

    // Risk コマンド
    this.bot.onText(/\/risk/, (msg) => {
      this.handleRisk(msg.chat.id);
    });

    // Disconnect コマンド
    this.bot.onText(/\/disconnect/, (msg) => {
      this.handleDisconnect(msg.chat.id);
    });

    // 通常メッセージ（コマンド以外）の処理
    this.bot.on("message", (msg) => {
      if (!msg.text?.startsWith("/")) {
        this.handleUserInput(msg.chat.id, msg.text || "");
      }
    });
  }

  // briefing を整形して送信するメソッド
  public async sendBriefing(
    chatId: number,
    briefing: AIRecommendation,
  ): Promise<void> {
    const message = `${briefing.title}
${briefing.description}

📈 Analysis:
${briefing.reasoning.map((r) => `• ${r}`).join("\n")}

📊 Data Sources:
${briefing.data_sources
  .map(
    (ds) => `${ds.type.toUpperCase()}:
${ds.key_points.map((p) => `- ${p}`).join("\n")}`,
  )
  .join("\n")}`;
    await this.sendMessage(chatId, message);
  }

  private async handleStart(chatId: number): Promise<void> {
    const defaultUserContext: UserContext = {
      wallet_address: "",
      risk_preference: "moderate",
      preferred_assets: ["ETH"],
      activity_history: [],
    };

    const newState: TelegramUserState = {
      chatId,
      userContext: defaultUserContext,
      lastInteraction: new Date(),
      setupComplete: false,
    };

    this.userStates.set(chatId, newState);
    await this.sendMessage(chatId, BOT_MESSAGES.welcome);
  }

  private async handleConnect(chatId: number): Promise<void> {
    const state = this.getUserState(chatId);
    state.awaitingInput = true;
    state.lastCommand = "/connect";
    this.userStates.set(chatId, state);
    await this.sendMessage(chatId, BOT_MESSAGES.connectWallet);
  }

  private async handleBrief(chatId: number): Promise<void> {
    const state = this.getUserState(chatId);
    if (!state.walletAddress) {
      await this.sendMessage(chatId, BOT_MESSAGES.noWalletConnected);
      return;
    }

    try {
      // 非 null アサーションで walletAddress の存在を保証する
      const briefing = await import("./aiService.js").then((module) =>
        module.aiService.getDailyBriefing(
          state.walletAddress!,
          state.userContext,
        ),
      );
      await this.sendBriefing(chatId, briefing);
    } catch (error) {
      console.error("Error fetching daily briefing", error);
      await this.sendMessage(chatId, BOT_MESSAGES.error);
    }
  }

  private async handleSettings(chatId: number): Promise<void> {
    const state = this.getUserState(chatId);
    state.lastCommand = "/settings";
    this.userStates.set(chatId, state);
    await this.sendMessage(chatId, BOT_MESSAGES.settingsMenu);
  }

  private async handleRisk(chatId: number): Promise<void> {
    const state = this.getUserState(chatId);
    state.lastCommand = "/risk";
    state.awaitingInput = true;
    this.userStates.set(chatId, state);
    await this.sendMessage(chatId, BOT_MESSAGES.riskPreferencePrompt);
  }

  private async handleDisconnect(chatId: number): Promise<void> {
    const state = this.getUserState(chatId);
    // walletAddress を undefined ではなく空文字にして型エラーを回避
    state.walletAddress = "";
    state.setupComplete = false;
    this.userStates.set(chatId, state);
    await this.sendMessage(chatId, BOT_MESSAGES.disconnectSuccess);
  }

  private async handleUserInput(chatId: number, text: string): Promise<void> {
    const state = this.getUserState(chatId);
    if (!state.awaitingInput) return;

    switch (state.lastCommand) {
      case "/connect":
        if (this.isValidEthereumAddress(text)) {
          state.walletAddress = text;
          state.setupComplete = true;
          state.awaitingInput = false;
          this.userStates.set(chatId, state);
          await this.sendMessage(chatId, BOT_MESSAGES.walletConnected);
        } else {
          await this.sendMessage(chatId, BOT_MESSAGES.invalidWallet);
        }
        break;

      case "/risk":
        const riskPreference = RISK_MAP[text];
        if (riskPreference) {
          state.userContext.risk_preference = riskPreference;
          state.awaitingInput = false;
          this.userStates.set(chatId, state);
          await this.sendMessage(chatId, BOT_MESSAGES.riskPreferenceSet);
        } else {
          await this.sendMessage(chatId, BOT_MESSAGES.riskPreferencePrompt);
        }
        break;
    }
  }

  private getUserState(chatId: number): TelegramUserState {
    let state = this.userStates.get(chatId);
    if (!state) {
      state = {
        chatId,
        userContext: {
          wallet_address: "",
          risk_preference: "moderate",
          preferred_assets: ["ETH"],
          activity_history: [],
        },
        lastInteraction: new Date(),
        setupComplete: false,
      };
      this.userStates.set(chatId, state);
    }
    return state;
  }

  private async sendMessage(chatId: number, text: string): Promise<void> {
    await this.bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
  }

  private isValidEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  public getAllConnectedUsers(): TelegramUserState[] {
    return Array.from(this.userStates.values()).filter(
      (state) => state.setupComplete && state.walletAddress,
    );
  }
}

export const createTelegramBot = (token: string): TelegramService => {
  return new TelegramService(token);
};
