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
  <div className="w-full h-screen"> {/* Full height of the viewport */}
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel minSize={15} maxSize={15} defaultSize={15} className="h-full w-full">
        <div className="flex flex-col items-center justify-center mt-4"> {/* Center items vertically */}
          <SheetAppointment />
          <CalendarSingle />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={85} className="h-full">
        <div className="p-4 w-full h-full">
          <FullFeaturedCalendar />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
);

export default AppointmentLayout;