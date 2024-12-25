"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useSetAtom } from "jotai";
import { TCurrentUser, currentUserAtom, sessionAtom } from "@/lib/jotai";
import axiosInstance from "@/config/axios/axiosInstance";
import useLocalStorage from "@/hooks/useLocalStorage";
import Cookies from 'js-cookie';
import { notification } from "antd";

const loginSchema = z.object({
  username: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function Home() {
  const { toast } = useToast();
  const setSession = useSetAtom(sessionAtom);
  const setCurrentUser = useSetAtom(currentUserAtom);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUserStorage] =
    useLocalStorage<TCurrentUser | null>("currentUser", null);

  const router = useRouter();
  useEffect(() => {
        const sessionCookie = Cookies.get('JSESSIONID');
        if (sessionCookie) {
          
            router.replace('/chat'); // Redirect to dashboard or preferred page
        }
    }, [router]);
  const customSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await handleSubmit(onSubmit)(e);
  };
  const onSubmit = async (data: any) => {
    setLoading(true);
    const { username, password } = data;

    try {
      const response = await axiosInstance.post("auth/login", data);
      if (response.status === 200) {
        const respUser = await axiosInstance.get("user/current-user");
        if (respUser.status === 200) {
          setCurrentUser(respUser.data);
          setCurrentUserStorage(respUser.data);
          router.push("/chat");
          notification.success({
            message: 'Đặng nhập thành công',
          })
        } else {
          notification.warning({
            message: 'Đặng nhập thất bại',
            description: 'Vui long kiểm tra thống tin đăng nhập'
          })
        }
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } catch (error) {
      notification.warning({
        message: 'Đặng nhập thất bại',
        description: 'Vui long kiểm tra thống tin đăng nhập'
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center align-middle h-screen items-center">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl  p-4 md:p-8 shadow-input bg-white dark:bg-black border-regal-green">
        <h1 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200 text-center">
          Đăng nhập
        </h1>

        <form
          className="my-8 justify-center align-middle"
          onSubmit={customSubmit}
        >
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              className="border-regal-green"
              placeholder="Congtv@gmail.com"
              type="email"
              {...register("username", { required: "Email is required" })}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              className="border-regal-green"
              id="password"
              placeholder="••••••••"
              type="password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </LabelInputContainer>
          <button
            disabled={loading}
            type="submit"
            className="mt-10 bg-gradient-to-br relative group/btn w-full text-black bg-regal-green h-10 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center me-2  dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
          >
            {loading ? <>
              <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 me-3 text-green animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            Loading...</> : 'Đăng nhập'}
          </button>

          {/* <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" /> */}
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
