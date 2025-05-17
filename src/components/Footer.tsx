import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Mail } from "lucide-react";
import { Tooltip } from "antd";
import SendMessageForm from "./send-form";

export function Footer() {
  // const navigation = ["Product", "Features", "Pricing", "Company", "Blog"];
  const legal = [{text: "Điều khoản và điều kiện", link: "/privacy"}];
  
  return (
    <footer className="w-full bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* First Column - Logo and Description */}
            <div className="space-y-6">
              <Link
                href="/"
                className="inline-block"
                aria-label="VietMind Home"
              >
                <Image
                  src="/image/vietmind.png"
                  alt="VietMind Logo"
                  width="100"
                  height="100"
                  className="h-auto w-auto"
                />
              </Link>
              <p className="text-base text-gray-600 dark:text-gray-400 max-w-md">
                Chúng tôi đang nỗ lực xây dựng một tương lai nơi mọi người Việt Nam đều có thể tìm thấy sự thấu hiểu và hỗ trợ về tâm lý.
              </p>
            </div>

            {/* Second Column - Contact Form */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Liên hệ
              </h3>
              <SendMessageForm />
            </div>

            {/* Third Column - Social Links and Legal */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Follow us
                </h3>
                <div className="flex space-x-4">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.facebook.com/profile.php?id=61572294333943"
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    aria-label="Visit our Facebook page"
                  >
                    <span className="sr-only">Facebook</span>
                    <Facebook />
                  </a>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="mailto:contact@vietmind.co"
                    className="text-gray-600 hover:text-[#a73944] dark:text-gray-400 dark:hover:text-[#a73944] transition-colors"
                    aria-label="Contact us via email"
                  >
                    <span className="sr-only">Email</span>
                    <Tooltip title="Bạn có thể liên lạc tới chúng tôi để biết thêm thông tin, yêu cầu xóa dữ liệu tại contact@vietmind.co">
                      <Mail className="w-6 h-6" />
                    </Tooltip>
                  </a>
                </div>
              </div>

              <div className="space-y-2">
                {legal.map((item: {text: string, link: string}, index) => (
                  <Link
                    key={index}
                    href={item.link}
                    className="block text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                  >
                    {item.text}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="py-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Copyright © {new Date().getFullYear()}. Made with ♥ by{" "}
            <a 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              vmind
            </a>{" "}
            from{" "}
            <a 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              BlockitTeam
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

const Facebook = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07" />
  </svg>
);



