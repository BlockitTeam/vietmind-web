import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar } from "lucide-react";
import ScheduleForm from "./scheduleForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

export function SheetAppointment() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
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
            Hai tuần từ 26 tháng 8 đến 1 tháng 9{" "}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea>
          <ScheduleForm isOpen={isOpen}/>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
