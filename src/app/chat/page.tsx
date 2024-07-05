import { cookies } from "next/headers";
import { ChatLayout } from "./components/chat-layout";
import HeaderChat from "@/components/headerChat";
import { getQueryClient } from "@/lib/get-query-client";
import { FetchCurrentUser } from "@/hooks/currentUser";
import {
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { FetchContentMessage } from "@/hooks/getContentMessage";
import { FetchConversation } from "@/hooks/conversation";


export default function ChatPage() {
  const layout = cookies().get("react-resizable-panels:layout");
  const collapsed = cookies().get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout?.value) : undefined;
  const defaultCollapsed =
    collapsed && collapsed.value ? JSON.parse(collapsed.value) : undefined;

    const queryClient = getQueryClient()
    void queryClient.prefetchQuery({
      queryKey: ['user'],
      queryFn: () => FetchCurrentUser(),
    })

    void queryClient.prefetchQuery({
      queryKey: ['contentConversationId', 1],
      queryFn: () => FetchContentMessage(1),
    })

    void queryClient.prefetchQuery({
      queryKey: ['conversation'],
      queryFn: () => FetchConversation(),
    })

  return (
    <div className="hidden z-10 min-w-full w-full h-full flex-col md:flex">
      <HeaderChat />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ChatLayout
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
        />
      </HydrationBoundary>
    </div>
  );
}
