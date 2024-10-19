import { ChatLayout } from "../chat/components/chat-layout";
import HeaderChat from "@/components/headerChat";
import { getQueryClient } from "@/lib/get-query-client";
import {
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import AppointmentLayout from "./components/appointment-layout";

export default function AppointmentPage() {

  return (
    <div className="hidden z-10 min-w-full w-full h-full flex-col md:flex">
      <HeaderChat />
      <HydrationBoundary >
        <AppointmentLayout />
      </HydrationBoundary>
    </div>
  );
}
