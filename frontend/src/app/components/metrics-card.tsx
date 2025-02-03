import { Card } from "../components/ui/card";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import type React from "react";

interface MetricsCardProps {
  title: string;
  value: string;
  change: {
    value: string;
    percentage: string;
    isPositive: boolean;
  };
  chart?: React.ReactNode;
}

export function MetricsCard({ title, value, change, chart }: MetricsCardProps) {
  return (
    <Card className="p-4 bg-background/50 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm text-muted-foreground">{title}</h3>
        {chart ? (
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        ) : null}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <div className="flex items-center gap-1 mt-1">
            {change.isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span
              className={`text-sm ${change.isPositive ? "text-green-500" : "text-red-500"}`}
            >
              {change.percentage}
            </span>
          </div>
        </div>
        {chart}
      </div>
    </Card>
  );
}
