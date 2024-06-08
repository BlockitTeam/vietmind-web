import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function WatchDetail() {
  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <a className="font-bold text-md underline">Xem chi tiết</a>
        </SheetTrigger>
        <SheetContent className="sm:max-w-[700px]">
          <SheetHeader>
            <SheetTitle>
            Kết quả sàng lọc của Trần Thủy
            </SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
