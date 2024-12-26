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

export type ConversationData = {
  conversation: {
    conversationId: number;
    userId: string;
    doctorId: string;
    encryptedConversationKey: string;
    conversationKey: string;
    createdAt: string;
    note: string;
    finished: boolean;
  };
  lastMessage: {
    messageId: number;
    conversationId: number;
    senderId: string;
    receiverId: string;
    isRead: boolean;
    encryptedMessage: string;
    createdAt: string;
  };
  senderFullName: string;
  receiverFullName: string;
};

type ConversationContextType = {
  conversations?: ConversationData[];
  refetchConversation: () => void;
  isSuccessConversationQuery: boolean;
  setConversationWs: (_conversations: ConversationData[]) => void;
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
  const [conversationDataWs, setConversationDataWs] = useState<ConversationData[]>([]);
  
  useEffect(() => {
    if (conversations?.data) {
      setConversationDataWs(conversations?.data);
    }
  }, [conversations, isSuccess, setConversationDataWs, conversationDataWs, searchTerm]);

  
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