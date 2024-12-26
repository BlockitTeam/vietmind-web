import HeaderChat from "@/components/headerChat";
import {
  HydrationBoundary,
} from "@tanstack/react-query";
import ResultLayout from "./components/Result-layout";


export default function ResultsPage() {

  return (
    <div className="z-10 min-w-full w-full h-full flex-col md:flex">
      <HeaderChat />
      <HydrationBoundary >
        <ResultLayout />
      </HydrationBoundary>
    </div>
  );
}
