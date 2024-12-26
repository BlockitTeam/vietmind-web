"use client";
import Link from "next/link";
import { CircleUser, Menu, Package2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation"; // Import usePathname
import { useRouter } from "next/navigation";
import { useLogoutHook } from "@/hooks/logout";
import { currentUserAtom } from "@/lib/jotai";
import { useAtom } from "jotai";
import { InformationDoctor } from "./InformationDoctor";
import { useRef } from "react";
import Cookies from "js-cookie";

export default function HeaderChat() {
  const pathname = usePathname(); // Get the current pathname
  const router = useRouter();
  const [, setCurrentUser] = useAtom(currentUserAtom);
  const useLogout = useLogoutHook();
  const dropdownMenuRef = useRef<HTMLButtonElement>(null);

  const handleInformationClick = () => {
    dropdownMenuRef.current?.click(); // Programmatically close the dropdown menu
  };

  const isActive = (href: any) => pathname === href; // Helper to check if link is active

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 w-screen z-10 p-3">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <Link
          href="/chat"
          className={`${isActive("/chat")
              ? "text-blue-500 font-bold border-b-2 border-b-regal-green"
              : "text-foreground"
            } transition-colors hover:text-foreground w-max`}
        >
          Chat
        </Link>
        <Link
          href="/appointment"
          className={`${isActive("/appointment")
              ? "text-blue-500 font-bold border-b-2 border-b-regal-green"
              : "text-muted-foreground"
            } transition-colors hover:text-foreground w-max`}
        >
          Lịch hẹn
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            {/* Add other links here */}
          </nav>
        </SheetContent>
      </Sheet>
      {/* Rest of your component */}
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          {/* <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div> */}
        </form>
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full" ref={dropdownMenuRef}>
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Cài đặt</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              onClick={() => {
                handleInformationClick();
              }}
            >
              <InformationDoctor />
            </DropdownMenuItem>
            {/* <DropdownMenuItem>Support</DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                useLogout.mutate(undefined, {
                  onSuccess(data) {
                    if (data.statusCode === 200) {
                      // Clear cookies and user state
                      setCurrentUser(null);
                      Cookies.remove("JSESSIONID");
                      // Redirect to the login or home page
                      router.push("/");
                    }
                  },
                  onError: (error) => {
                    console.error("An error occurred:", error);
                  },
                });
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
