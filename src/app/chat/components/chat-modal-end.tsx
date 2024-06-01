import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function EndChat() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-neutral-primary border-regal-green bg-regal-green hover:bg-regal-green h-[30px]">
          Kết thúc tư vấn
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="mb-2">
            <p>Kết thúc buổi tư vấn</p>
          </DialogTitle>
          <DialogDescription>
            Sau khi kết thúc, bạn sẽ không thể tiếp tục chat với người dùng.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-end">
          <DialogClose className="flex gap-2">
            <Button className="border-regal-green h-[35px]" variant={"outline"}>
              Quay lại
            </Button>
            <Button className="text-neutral-primary border-regal-green bg-regal-green hover:bg-regal-green h-[35px]">
              Đồng ý & kết thúc
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
