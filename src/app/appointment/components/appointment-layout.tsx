"use client";
import React from "react";
import FullFeaturedCalendar from "./table-calender";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { CalendarSingle } from "./calendar";
import { SheetAppointment } from "./sheet-appointment";

const AppointmentLayout: React.FC = () => (
  <div className="w-full h-screen overflow-scroll">
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel minSize={20} maxSize={20} defaultSize={20} className="w-full h-full m-4">
        <div className="flex flex-col items-center justify-center w-full">
          <SheetAppointment />
          <CalendarSingle />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={80} className="h-fit">
        <div className="p-4 w-full h-full">
          <FullFeaturedCalendar />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
);

export default AppointmentLayout;