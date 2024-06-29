import { cookies } from "next/headers";
import { ChatLayout } from "./components/chat-layout";
import HeaderChat from "@/components/headerChat";
import { getQueryClient } from "@/lib/get-query-client";
import { useCurrentUserHook } from "@/hooks/currentUser";
import {
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { useContentMessageHook } from "@/hooks/getContentMessage";
import { useGetConversation } from "@/hooks/conversation";
export default function ChatPage() {
  const layout = cookies().get("react-resizable-panels:layout");
  const collapsed = cookies().get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout?.value) : undefined;
  const defaultCollapsed =
    collapsed && collapsed.value ? JSON.parse(collapsed.value) : undefined;
    const queryClient = getQueryClient()
    void queryClient.prefetchQuery({
      queryKey: ['user'],
      queryFn: () => useCurrentUserHook(),
    })

    void queryClient.prefetchQuery({
      queryKey: ['contentConversationId'],
      queryFn: () => useContentMessageHook(),
    })

    void queryClient.prefetchQuery({
      queryKey: ['conversation'],
      queryFn: () => useGetConversation(),
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
