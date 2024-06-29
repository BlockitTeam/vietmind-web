// WebSocketContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import useWebSocket, { ReadyState, SendMessage, Options } from 'react-use-websocket';

interface WebSocketContextType {
  sendMessage: SendMessage;
  lastMessage: MessageEvent<any> | null;
  readyState: ReadyState;
  updateUrl: (newParams: Record<string, string>) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [url, setUrl] = useState('wss://your-websocket-url');

  const options: Options = {
    onOpen: () => console.log("WebSocket connection established"),
  };

  const { sendMessage, lastMessage, readyState } = useWebSocket(url, options);

  const updateUrl = useCallback((newParams: Record<string, string>) => {
    const urlObject = new URL(url);
    Object.keys(newParams).forEach(key => {
      urlObject.searchParams.set(key, newParams[key]);
    });
    setUrl(urlObject.toString());
  }, [url]);

  useEffect(() => {
    // Trigger a re-connection when URL changes
  }, [url]);

  return (
    <WebSocketContext.Provider value={{ sendMessage, lastMessage, readyState, updateUrl }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};