import Image from "next/image";
import React from "react";
import { Container } from "@/components/Container";

import tracnghiem from "../../public/image/tracnghiem.png";
import home from "../../public/image/home.png";
import information from "../../public/image/information.png";
import { TextGenerateEffect } from "./text-generate-effect";

export const Testimonials = () => {
  return (
    <Container className="mb-7">
      <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-3">
        <div className="lg:col-span-2 xl:col-auto">
          <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-10 rounded-2xl py-14 dark:bg-trueGray-800 items-center">
            <Image src={home} height={535} width={273} alt="khue" className="border-1 border-solid rounded-md" />
            <TextGenerateEffect words="Nếu cần, hãy lên lịch để trò chuyện với một nhà trị liệu thực sự." />
          </div>
        </div>
        <div className="lg:col-span-2 xl:col-auto">
          <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-10 rounded-2xl py-14 dark:bg-trueGray-800 items-center">
            <Image src={information} height={535} width={273} alt="khue" className="border-1 border-solid rounded-md" />
            <TextGenerateEffect words="Đăng nhập vào ứng dụng và nhập thông tin cá nhân." />
          </div>
        </div>
        <div className="lg:col-span-2 xl:col-auto">
          <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-10 rounded-2xl py-14 dark:bg-trueGray-800 items-center">
            <Image src={tracnghiem} height={535} width={273} alt="khue" className="border-1 border-solid rounded-md" />
            <TextGenerateEffect words="Điền vào một bảng câu hỏi ngắn về những mối quan tâm hiện tại của bạn." />
          </div>
        </div>
      </div>
    </Container>
  );
};