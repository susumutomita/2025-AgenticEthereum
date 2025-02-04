export interface MarketData {
  symbol: string;
  price: string;
  change24h: string;
  volume24h: string;
  timestamp: string;
}

export interface SocialSignal {
  platform: "telegram" | "twitter";
  sentiment: "positive" | "negative" | "neutral";
  volume: number;
  trending_topics: string[];
  timestamp: string;
}

export interface WalletAnalysis {
  address: string;
  total_balance: string;
  active_tokens: Array<{
    symbol: string;
    balance: string;
    value_usd: string;
  }>;
  recent_activity: Array<{
    type: "swap" | "transfer" | "liquidity" | "other";
    description: string;
    timestamp: string;
  }>;
  risk_level: "low" | "medium" | "high";
  gas_usage_30d: string;
}

export interface AIRecommendation {
  type: "action" | "warning" | "information";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  reasoning: string[];
  data_sources: Array<{
    type: "market" | "social" | "wallet";
    key_points: string[];
  }>;
  timestamp: string;
}

export interface UserContext {
  wallet_address: string;
  risk_preference: "conservative" | "moderate" | "aggressive";
  preferred_assets: string[];
  activity_history: Array<{
    action: string;
    timestamp: string;
    feedback?: "positive" | "negative";
  }>;
}
