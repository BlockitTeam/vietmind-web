"use client";
import React, { FormEvent, useState } from "react";
import { cn } from "@/utils/cn";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import * as z from "zod";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useSetAtom } from "jotai";
import { sessionAtom } from "@/lib/jotai";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function Home() {
  const { toast } = useToast();
  const setSession = useSetAtom(sessionAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const customSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await handleSubmit(onSubmit)(e);
  };
  const onSubmit = async (data: any) => {
    setLoading(true);
    const { email, password } = data;
    const res = await fetch("api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (res && res.ok) {
      const cookies = res.headers.get("set-cookie");
      const jsessionId = cookies?.match(/JSESSIONID=([^;]+)/)?.[1];

      if (jsessionId) {
        setSession(jsessionId);
      }
      router.push("/chat");
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      // alert("Login failed");
    }
    setLoading(false);
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
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
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
            className="mt-10 bg-gradient-to-br relative group/btn w-full text-black bg-regal-green rounded-md h-10 font-medium"
            type="submit"
          >
            Đăng nhập
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
