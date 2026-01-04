import { useGetConversation } from "@/hooks/conversation";
import React , {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDebounce } from "use-debounce";

// API response format for conversations
export type LastMessage = {
  messageId: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  message: string;
  createdAt: string;
};

export type ConversationData = {
  id: string;
  patientId: string;
  patientName: string;
  patientUsername: string;
  lastMessage?: LastMessage;
  lastMessageAt?: string;
  unreadCount: number;
  note: string;
  createdAt: string;
};

// Wrapper type that matches API response structure
export type ConversationsResponse = {
  data?: ConversationData[];
};

type ConversationContextType = {
  conversations?: ConversationsResponse;
  refetchConversation: () => void;
  isSuccessConversationQuery: boolean;
  setConversationWs: (_conversations: ConversationsResponse) => void;
  setSearchTerm: (_searchTerm: string) => void;
};


const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

export const ConversationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [debouncedSearchTerm] = useDebounce(searchTerm, 200); // 300ms debounce

  const { data: conversations, refetch, isSuccess } = useGetConversation(debouncedSearchTerm);
  const [conversationDataWs, setConversationDataWs] = useState<ConversationsResponse>({});
   
  useEffect(() => {
    // API returns nested structure: { data: { data: [...], auditId }, statusCode }
    const conversationsArray = (conversations?.data as any)?.data;
    if (Array.isArray(conversationsArray)) {
      setConversationDataWs({ data: conversationsArray });
    }
  }, [conversations, isSuccess]);

  
  const value = useMemo(
    () => ({
      conversations: conversationDataWs,
      refetchConversation: refetch,
      isSuccessConversationQuery: isSuccess,
      setConversationWs: setConversationDataWs,
      setSearchTerm
    }),
    [conversationDataWs, refetch, isSuccess, setConversationDataWs, setSearchTerm]
  );

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversationContext = () => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error(
      "useConversationContext must be used within a ConversationProvider"
    );
  }
  return context;
};