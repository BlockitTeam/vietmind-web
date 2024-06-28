import { atom } from "jotai";
import { unknown } from "zod";

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
export const privateKeyAtom = atom<string | null>(null);
export const publicKeyAtom = atom<string | null>(null);
export const aesKeyAtom = atom<CryptoJS.lib.WordArray | null>(null);

export type TCurrentUser = {
  birthYear: number;
  enabled: boolean;
  firstName: string;
  gender: string;
  id: string;
  lastName: string;
  password: string;
  provider: string;
  publicKey: string;
  roles: Array<string>;
  surveyCompleted: string;
  username: string;
};
export const currentUserAtom = atom<TCurrentUser | null>(null);
