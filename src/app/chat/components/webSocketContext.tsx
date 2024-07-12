//@ts-nocheck
import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

interface WebSocketContextType {
  sendMessageWS: (message: string) => void;
  lastMessage: WebSocket.MessageEvent<any> | null;
  readyState: ReadyState;
  updateUrl: (targetUserId: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);
export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
const NEXT_PUBLIC_SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
  const [socketUrl, setSocketUrl] = useState(NEXT_PUBLIC_SOCKET_URL);
  const { sendMessage: sendMessageWS, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("WebSocket connection established"),
  });

  const updateUrl = (targetUserId: string) => {
    const updatedSocketUrl = `${NEXT_PUBLIC_SOCKET_URL}?targetUserId=${targetUserId}`;
    setSocketUrl(updatedSocketUrl);
  };

  const value = useMemo(
    () => ({ sendMessageWS, lastMessage, readyState, updateUrl }),
    [sendMessageWS, lastMessage, readyState]
  );

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider");
  }
  return context;
};