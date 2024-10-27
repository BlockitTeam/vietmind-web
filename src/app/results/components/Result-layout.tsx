"use client";
import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ResultTable from "./Result-table";

const ResultLayout: React.FC = () => (
  <div className="w-full h-screen overflow-scroll">
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel minSize={15} maxSize={15} defaultSize={15} className="w-full h-full mt-5">
        <div className="flex flex-col items-center justify-center w-full">
            <h1>12312</h1>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={85} className="h-fit">
        <div className="p-4 w-full h-full">
        <ResultTable/>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
);

export default ResultLayout;