"use client";

import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";

export function CurrencyToggle({
  showUSD,
  setShowUSD,
}: {
  showUSD: boolean;
  setShowUSD: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Info className="h-4 w-4 text-indigo-400" />
      <span className="text-sm text-gray-400">Display USD pricing</span>
      <Switch
        checked={showUSD}
        onCheckedChange={setShowUSD}
        className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-gray-700"
      />
    </div>
  );
}
