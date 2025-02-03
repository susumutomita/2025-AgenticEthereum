import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";

// Added type definition for WalletData
type WalletData = {
  marketSentiment: string;
  marketTrend: "up" | "down" | string;
  recommendedActions: string[];
  riskLevel: string;
  taxAdvice: string;
};

export function DailyBriefing({ walletData }: { walletData: WalletData }) {
  if (!walletData) {
    return (
      <Card className="bg-background/50 backdrop-blur">
        <CardContent>
          Please enter a wallet address to view your daily briefing.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Today&apos;s Investment Brief</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Market Sentiment</h3>
              <p className="text-sm text-muted-foreground">
                {walletData.marketSentiment}
              </p>
            </div>
            {walletData.marketTrend === "up" ? (
              <TrendingUp className="h-6 w-6 text-green-500" />
            ) : (
              <TrendingDown className="h-6 w-6 text-red-500" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Recommended Actions</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              {walletData.recommendedActions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Risk Management</h3>
            <p className="text-sm text-muted-foreground">
              Your current portfolio risk level: {walletData.riskLevel}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Tax Optimization</h3>
            <p className="text-sm text-muted-foreground">
              {walletData.taxAdvice}
            </p>
          </div>
          <Button className="w-full mt-4">
            View Detailed Report
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
