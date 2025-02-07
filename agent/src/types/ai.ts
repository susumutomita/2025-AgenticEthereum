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
