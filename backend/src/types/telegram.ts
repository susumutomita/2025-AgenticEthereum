import { UserContext } from "./ai.js";

export type BotCommand =
  | "/start"
  | "/help"
  | "/connect"
  | "/brief"
  | "/settings"
  | "/risk"
  | "/disconnect";

export interface TelegramUserState {
  chatId: number;
  walletAddress?: string;
  userContext: UserContext;
  lastCommand?: BotCommand;
  lastInteraction: Date;
  awaitingInput?: boolean;
  setupComplete: boolean;
}

export interface CommandHandler {
  command: BotCommand;
  description: string;
  handler: (chatId: number, args?: string) => Promise<void>;
}

export type MessageTemplate = {
  welcome: string;
  help: string;
  connectWallet: string;
  walletConnected: string;
  invalidWallet: string;
  briefingHeader: string;
  noWalletConnected: string;
  settingsMenu: string;
  riskPreferencePrompt: string;
  riskPreferenceSet: string;
  disconnectSuccess: string;
  error: string;
};

export const BOT_MESSAGES: MessageTemplate = {
  welcome: `Welcome to CryptoDaily Brief! 🎉
I'll help you track your crypto portfolio and provide daily insights.
Use /connect to link your wallet and get started.`,

  help: `Available commands:
/connect - Link your Ethereum wallet
/brief - Get your daily portfolio briefing
/settings - Configure your preferences
/risk - Set your risk preference
/disconnect - Unlink your wallet
/help - Show this help message`,

  connectWallet: "Please send your Ethereum wallet address to connect:",

  walletConnected:
    "Wallet successfully connected! 🎉\nUse /brief to get your first portfolio analysis.",

  invalidWallet:
    "Invalid wallet address. Please check the address and try again.",

  briefingHeader: "📊 Daily Crypto Brief",

  noWalletConnected: "Please connect your wallet first using /connect",

  settingsMenu: `⚙️ Settings Menu:
1. Risk Preference
2. Notification Time
3. Asset Preferences

Reply with a number to configure:`,

  riskPreferencePrompt: `Select your risk preference:
1. Conservative 🔷
2. Moderate 🔶
3. Aggressive 🔺`,

  riskPreferenceSet: "Risk preference updated successfully! 👍",

  disconnectSuccess:
    "Wallet disconnected successfully. Use /connect to link a new wallet.",

  error: "Sorry, something went wrong. Please try again later.",
};
