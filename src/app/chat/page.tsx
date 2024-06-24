import { cookies } from "next/headers";
import { ChatLayout } from "./components/chat-layout";
import HeaderChat from "@/components/headerChat";
import { getQueryClient } from "@/lib/get-query-client";
import { useCurrentUserHook } from "@/hooks/currentUser";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'
export default async function ChatPage() {
  const layout = cookies().get("react-resizable-panels:layout");
  const collapsed = cookies().get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout?.value) : undefined;
  const defaultCollapsed =
    collapsed && collapsed.value ? JSON.parse(collapsed.value) : undefined;
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
      queryKey: ['user'],
      queryFn: () => useCurrentUserHook(),
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
