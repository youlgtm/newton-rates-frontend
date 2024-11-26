export interface Rate {
  symbol: string;
  spot: number;
  bid: number;
  ask: number;
  change: number;
}

export interface CryptoCardProps {
  symbol: string;
  change: number;
  iconUrl?: string;
  iconBg: string;
}

export interface CryptoMeta {
  prefix: string;
  name: string;
  iconUrl: string;
  color: string;
}

export interface WebSocketContextType {
  data: Rate[];
  isConnected: boolean;
  connectionStatus: string;
}
