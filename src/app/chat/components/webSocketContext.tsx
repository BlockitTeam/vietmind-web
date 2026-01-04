import React, { createContext, useContext, useMemo, useState, ReactNode, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

interface ChatMessage {
  fromUserId: string;
  socketId: string;
  conversationId: string;
  message: string;
  messageId: string;
  type: string;
  createAt: string;
}

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: ChatMessage | null;
  isTyping: { conversationId: string; fromUserId: string } | null;
  sendMessage: (targetUserId: string, message: string, conversationId: string) => void;
  sendTyping: (targetUserId: string, conversationId: string) => void;
  sendStopTyping: (targetUserId: string, conversationId: string) => void;
  sendRawMessage: (event: string, data: any) => void;
  socketId: string | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<ChatMessage | null>(null);
  const [isTyping, setIsTyping] = useState<{ conversationId: string; fromUserId: string } | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) return;

    // Connect to Socket.IO server
    const socket = io(NEXT_PUBLIC_API_URL, {
      auth: { token: accessToken },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("✅ Socket.IO connected:", socket.id);
      setIsConnected(true);
      setSocketId(socket.id || null);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket.IO disconnected");
      setIsConnected(false);
      setSocketId(null);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
    });

    // Listen for new messages
    socket.on("chat_message", (data: ChatMessage) => {
      console.log("📩 New message:", data);
      // Skip if it's from the same socket (echo prevention)
      if (data.socketId === socket.id) {
        return;
      }
      setLastMessage(data);
    });

    // Listen for typing events
    socket.on("chat_typing", (data: any) => {
      console.log("✍️ Typing event received (raw):", JSON.stringify(data));
      // Skip if it's from the same socket (echo prevention)
      if (data.socketId === socket.id) {
        return;
      }
      // Map the backend field names to our expected format
      setIsTyping({
        conversationId: data.conversationId || data.conversation_id || data.convId || "",
        fromUserId: data.fromUserId || data.from_user_id || data.userId || ""
      });
    });

    // Listen for stop typing events
    socket.on("chat_untyping", (data: any) => {
      console.log("🛑 Stop typing event received (raw):", JSON.stringify(data));
      // Skip if it's from the same socket (echo prevention)
      if (data.socketId === socket.id) {
        return;
      }
      setIsTyping(null);
    });

    // Listen for errors
    socket.on("chat_error", (data: { message: string }) => {
      console.error("❌ Chat error:", data.message);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [NEXT_PUBLIC_API_URL]);

  // Send a chat message
  const sendMessage = useCallback((targetUserId: string, message: string, conversationId: string) => {
    if (!socketRef.current) return;
    
    socketRef.current.emit("chat", {
      type: "message",
      targetUserId,
      message,
      conversationId,
    });
  }, []);

  // Send typing indicator
  const sendTyping = useCallback((targetUserId: string, conversationId: string) => {
    if (!socketRef.current) return;
    
    socketRef.current.emit("chat", {
      type: "typing",
      targetUserId,
      conversationId,
    });
  }, []);

  // Send stop typing indicator
  const sendStopTyping = useCallback((targetUserId: string, conversationId: string) => {
    if (!socketRef.current) return;
    
    socketRef.current.emit("chat", {
      type: "unTyping",
      targetUserId,
      conversationId,
    });
  }, []);

  // Send raw message for custom events (e.g., appointment notifications)
  const sendRawMessage = useCallback((event: string, data: any) => {
    if (!socketRef.current) return;
    socketRef.current.emit(event, data);
  }, []);

  const value = useMemo(() => ({
    isConnected,
    lastMessage,
    isTyping,
    sendMessage,
    sendTyping,
    sendStopTyping,
    sendRawMessage,
    socketId,
  }), [isConnected, lastMessage, isTyping, sendMessage, sendTyping, sendStopTyping, sendRawMessage, socketId]);

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider");
  }
  return context;
};
