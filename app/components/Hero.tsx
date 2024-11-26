import { Button } from "@/components/ui/button";
import { CryptoCard } from "./CryptoCard";
import { CRYPTO_META } from "../utils/constants";
import { useWebSocketContext } from "../providers/WebSocketContext";

export function Hero() {
  const { data } = useWebSocketContext();

  const getPriceData = (symbol: string) => {
    const tokenData = data?.find((item) => item.symbol === `${symbol}_CAD`);
    return Number(tokenData?.change || 0).toFixed(2);
  };
  return (
    <div className="p-1 py-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome to Newton!</h1>
          <p className="text-gray-400 mb-4">Crypto for Canadians</p>
          <Button className="bg-teal-500 hover:bg-teal-600 rounded-full px-8 py-2 text-black font-bold">
            SIGN UP
          </Button>
        </div>
        <div className="flex gap-4">
          <CryptoCard
            symbol="BTC"
            change={Number(getPriceData("BTC"))}
            iconUrl={CRYPTO_META.find((c) => c.prefix === "BTC")?.iconUrl}
            iconBg="bg-orange-500"
          />
          <CryptoCard
            symbol="ETH"
            change={Number(getPriceData("ETH"))}
            iconUrl={CRYPTO_META.find((c) => c.prefix === "ETH")?.iconUrl}
            iconBg="bg-blue-500"
          />
          <CryptoCard
            symbol="DOT"
            change={Number(getPriceData("DOT"))}
            iconUrl={CRYPTO_META.find((c) => c.prefix === "DOT")?.iconUrl}
            iconBg="bg-pink-500"
          />
        </div>
      </div>
    </div>
  );
}
