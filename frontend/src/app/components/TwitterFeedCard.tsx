"use client";
import React from "react";
import { Card } from "./ui/card";

interface TwitterFeedCardProps {
  unifiedCardClass?: string;
}

export function TwitterFeedCard({ unifiedCardClass }: TwitterFeedCardProps) {
  return (
    <Card className={unifiedCardClass}>
      <h2 className="text-xl font-semibold mb-4">Twitter Feed</h2>
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </Card>
  );
}
