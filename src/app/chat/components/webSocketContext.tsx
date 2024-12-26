import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

interface WebSocketContextType {
  lastMessage: MessageEvent<any> | null;
  readyState: ReadyState;
  sendMessageWS: (_message: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);
export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
const NEXT_PUBLIC_SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
  const [socketUrl,] = useState(NEXT_PUBLIC_SOCKET_URL || "");
  const { sendMessage: sendMessageWS, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("WebSocket connection established"),
    onClose: () => console.log("WebSocket connection closed"),
    onError: (error) => console.error("WebSocket error:", error),
  });

  const value = useMemo(() => ({
    lastMessage,
    readyState,
    sendMessageWS,
  }), [lastMessage, readyState, sendMessageWS]);

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider");
  }
  return context;
};