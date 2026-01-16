import HeaderChat from "@/components/headerChat";
import AppointmentLayout from "./components/appointment-layout";

export default function AppointmentPage() {
  return (
    <div className="z-10 min-w-full w-full h-full flex-col md:flex">
      <HeaderChat />
      <AppointmentLayout />
    </div>
  );
}
