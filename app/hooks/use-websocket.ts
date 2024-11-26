"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Rate } from "../components/types/types";
import { WEBSOCKET_URL } from "../utils/constants";

export function useWebSocket() {
  const [data, setData] = useState<Record<string, Rate>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    | "initializing"
    | "connected"
    | "closed"
    | "reconnecting"
    | "failed"
    | "error"
    | "stale"
    | "no connection"
  >("initializing");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const lastMessageTimeRef = useRef<number>(Date.now());
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000;

  const connect = useCallback(() => {
    if (wsRef.current) {
      return wsRef.current;
    }

    const ws = new WebSocket(WEBSOCKET_URL);

    ws.onopen = () => {
      setIsConnected(true);
      setConnectionStatus("connected");
      reconnectAttemptsRef.current = 0;
      lastMessageTimeRef.current = Date.now();

      ws.send(
        JSON.stringify({
          event: "subscribe",
          channel: "rates",
        })
      );
    };

    ws.onmessage = (event) => {
      lastMessageTimeRef.current = Date.now();
      try {
        const rawData = event.data;

        const message =
          typeof rawData === "string" ? JSON.parse(rawData) : rawData;

        if (message.channel === "rates" && message.data) {
          setData((prevData) => {
            let newData: Record<string, Rate> = {};

            if (Array.isArray(message.data)) {
              newData = message.data.reduce(
                (acc: Record<string, Rate>, item: Rate) => {
                  if (item.symbol) {
                    acc[item.symbol] = item;
                  }
                  return acc;
                },
                {}
              );
            } else if (message.data.symbol) {
              newData = { [message.data.symbol]: message.data };
            }

            const mergedData = { ...prevData, ...newData };
            return mergedData;
          });
        } else {
          console.log("Received message in unexpected format:", message);
        }
      } catch (error) {
        console.error(error);
      }
    };
    ws.onclose = (event) => {
      setIsConnected(false);
      setConnectionStatus("closed");
      wsRef.current = null;

      if (event.code !== 1000) {
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current += 1;
          const delay =
            RECONNECT_DELAY * Math.min(reconnectAttemptsRef.current, 5);

          setConnectionStatus("reconnecting");

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          setConnectionStatus("failed");
        }
      }
    };

    ws.onerror = (error) => {
      setConnectionStatus("error");
    };

    wsRef.current = ws;
    return ws;
  }, []);

  useEffect(() => {
    connect();

    const heartbeatInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            event: "ping",
            timestamp: Date.now(),
          })
        );
        lastMessageTimeRef.current = Date.now();
      }
    }, 15000);

    return () => {
      clearInterval(heartbeatInterval);

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (wsRef.current) {
        wsRef.current.close(1000, "Cleanup");
        wsRef.current = null;
      }
    };
  }, [connect]);

  useEffect(() => {
    const healthCheck = setInterval(() => {
      if (!wsRef.current) {
        setConnectionStatus("no connection");
        return;
      }

      const timeSinceLastMessage = Date.now() - lastMessageTimeRef.current;
      if (timeSinceLastMessage > 30000) {
        setConnectionStatus("stale");
        if (wsRef.current) {
          wsRef.current.close(1000, "Connection stale");
        }
      }
    }, 5000);

    return () => {
      clearInterval(healthCheck);
    };
  }, []);

  return {
    data: Object.values(data),
    isConnected,
    connectionStatus,
    reconnectAttempts: reconnectAttemptsRef.current,
  };
}
