import { atom } from "jotai";
import { unknown } from "zod";

type TStatusAppointment = null | 'PENDING' | 'CANCELLED' | 'CONFIRMED';
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
export const conversationIdAtom = atom<number>(0);
export const conversationIdContentAtom = atom([]);
export const userIdTargetUserAtom = atom<string | number>('');
export const TypingMessageAtom = atom<boolean>(false);
export const senderFullNameAtom = atom<string>('')

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

export type IUserConversationId = {
  senderFullName: string,
  conversationId: string | number,
  userId: string
}
export const currentUserAtom = atom<TCurrentUser | null>(null);
export const userConversationIdAtom = atom<IUserConversationId | null>(null);


