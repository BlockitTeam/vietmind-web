import { atom } from "jotai";

type TStatusAppointment = null | "waitingForAccept" | "accepted";
type TAppointmentDetail = {
  status: TStatusAppointment;
  data: {
    appointmentContent: string;
    date: string;
    from: string;
    to: string;
    notes: string;
    user: string;
  };
};

export const appointmentAtom = atom(false);
export const appointmentDetailAtom = atom<TAppointmentDetail>({
  status: null,
  data: {
    appointmentContent: "",
    date: "",
    from: "",
    to: "",
    notes: "",
    user: "",
  },
});

export const sessionAtom = atom<string | null>(null);
export const currentUserAtom = atom<any>(null);