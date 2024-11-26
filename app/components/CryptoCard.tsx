import type { CryptoCardProps } from "./types/types";
export function CryptoCard({ symbol, change, iconUrl }: CryptoCardProps) {
  const isPositive = change > 0;

  return (
    <div className="bg-[#1c1d33] rounded-lg p-4 w-[120px]">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2`}
      >
        <img src={iconUrl} alt={symbol} className="w-6 h-6" />
      </div>
      <div className="text-white font-medium">{symbol}</div>
      <div
        className={`flex items-center ${
          isPositive ? "text-teal-400" : "text-red-400"
        }`}
      >
        <span className="mr-1">{isPositive ? "▲" : "▼"}</span>
        {Math.abs(change)}%
      </div>
    </div>
  );
}
