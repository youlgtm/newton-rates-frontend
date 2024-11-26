import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { CRYPTO_META } from "../utils/constants";
import type { CryptoMeta } from "./types/types";
import { useCallback, useState, useMemo } from "react";
import { useWebSocketContext } from "../providers/WebSocketContext";

type SortField = "name" | "change" | "spot" | "bid" | "ask";

const USD_RATE = 0.74;

export function CryptoTable({
  searchQuery,
  showUSD,
}: {
  searchQuery: string;
  showUSD: boolean;
}) {
  const { data } = useWebSocketContext();
  const [sortField, setSortField] = useState<SortField>("spot");
  const [isAscending, setIsAscending] = useState(false);

  const getPriceData = useCallback(
    (symbol: string) => {
      const tokenData = data?.find((item) => item.symbol === `${symbol}_CAD`);
      const convertPrice = (price: number) =>
        showUSD ? price * USD_RATE : price;

      return {
        change: Number(tokenData?.change || 0).toFixed(2),
        spot: convertPrice(Number(tokenData?.spot || 0)).toLocaleString(
          "en-US",
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        ),
        bid: convertPrice(Number(tokenData?.bid || 0)).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        ask: convertPrice(Number(tokenData?.ask || 0)).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      };
    },
    [data, showUSD]
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setIsAscending(!isAscending);
    } else {
      setSortField(field);
      setIsAscending(false);
    }
  };

  const filteredAndSortedCrypto = useMemo(() => {
    const filtered = CRYPTO_META.filter((crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortField === "name") {
        return isAscending
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }

      const aData = data?.find((item) => item.symbol === `${a.prefix}_CAD`);
      const bData = data?.find((item) => item.symbol === `${b.prefix}_CAD`);
      const aValue = aData?.[sortField] || 0;
      const bValue = bData?.[sortField] || 0;

      return isAscending ? aValue - bValue : bValue - aValue;
    });
  }, [data, searchQuery, sortField, isAscending]);

  return (
    <div className="-ml-8">
      <div className="grid grid-cols-[1fr_150px_150px_150px_150px_50px] gap-4 mb-4 text-sm text-gray-400">
        <button
          onClick={() => handleSort("name")}
          className="pl-12 text-left flex items-center gap-2 hover:text-white"
        >
          <div className="flex flex-col text-[10px] leading-[8px] text-gray-600">
            <span>▲</span>
            <span>▼</span>
          </div>
          <span>Coin</span>
        </button>
        <button
          onClick={() => handleSort("change")}
          className="flex items-center gap-2 hover:text-white"
        >
          <div className="flex flex-col text-[10px] leading-[8px] text-gray-600">
            <span>▲</span>
            <span>▼</span>
          </div>
          <span>24h change</span>
        </button>
        <button
          onClick={() => handleSort("spot")}
          className="flex items-center gap-2 hover:text-white"
        >
          <div className="flex flex-col text-[10px] leading-[8px] text-gray-600">
            <span>▲</span>
            <span>▼</span>
          </div>
          <span>Live price</span>
        </button>
        <button
          onClick={() => handleSort("bid")}
          className="flex items-center gap-2 hover:text-white"
        >
          <div className="flex flex-col text-[10px] leading-[8px] text-gray-600">
            <span>▲</span>
            <span>▼</span>
          </div>
          <span>Sell price</span>
        </button>
        <button
          onClick={() => handleSort("ask")}
          className="flex items-center gap-2 hover:text-white"
        >
          <div className="flex flex-col text-[10px] leading-[8px] text-gray-600">
            <span>▲</span>
            <span>▼</span>
          </div>
          <span>Buy price</span>
        </button>
        <div>Watch</div>
      </div>

      {filteredAndSortedCrypto.map((crypto: CryptoMeta) => {
        const priceData = getPriceData(crypto.prefix);
        return (
          <div
            key={crypto.prefix}
            className="relative grid grid-cols-[1fr_150px_150px_150px_150px_50px] gap-4 items-center py-4"
          >
            <div className="absolute top-0 left-[3%] right-[0%] border-t border-[0.5px] border-gray-800" />
            <div className="flex items-center gap-3">
              <div className="absolute left-4">
                <img
                  src={crypto.iconUrl}
                  alt={crypto.name}
                  className="w-8 h-8"
                />
              </div>
              <div className="pl-16">
                <div className="font-medium">{crypto.name}</div>
                <div className="text-sm text-gray-400">
                  {crypto.prefix + (showUSD ? " / USD" : " / CAD")}
                </div>
              </div>
            </div>
            <div
              className={
                Number(priceData.change) >= 0 ? "text-teal-500" : "text-red-500"
              }
            >
              {Number(priceData.change) > 0 ? "+" : ""}
              {priceData.change}%
            </div>
            <div>${priceData.spot}</div>
            <div>${priceData.bid}</div>
            <div>${priceData.ask}</div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-yellow-400 hover:bg-transparent"
            >
              <Star className="h-5 w-5" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
