import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Calendar } from "lucide-react";
import ScheduleForm from "./scheduleForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useGetScheduleAppointment } from "@/hooks/appointment";

export function SheetAppointment() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: scheduleAppointment } = useGetScheduleAppointment();

  const handleOpenChange = (openState: boolean) => {
    setIsOpen(openState);
  };

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="w-[268px] border-regal-green bg-regal-green text-black hover:bg-regal-green hover:text-white mb-2">
          <Calendar size={17} className="mr-2" /> Đặt lịch làm việc
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[600px]">
        <SheetHeader>
          <SheetTitle>Đặt lịch làm việc</SheetTitle>
          <SheetDescription>
            Lịch làm việc trong một tuần
          </SheetDescription>
        </SheetHeader>
        <ScrollArea>
          <ScheduleForm
            visible={isOpen}
            scheduleAppointment={scheduleAppointment?.data}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}