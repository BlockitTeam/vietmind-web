import {
  ChartBarSquareIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
  ChartPieIcon
} from "@heroicons/react/24/solid";

const benefitOne = {
  title: "Thông tin",
  desc: "Chúng tôi đang nỗ lực xây dựng một tương lai nơi mọi người Việt Nam đều có thể tìm thấy sự thấu hiểu và hỗ trợ về tâm lý.",
  image: "/image/benefit-one.png",
  bullets: [
    {
      title: "26%",
      desc: "Thanh thiếu niên Việt Nam có nguy cơ gặp vấn đề sức khỏe tâm thần ở mức độ vừa đến cao UNICEF.",
      icon: <ChartPieIcon />,
    },
    {
      title: "1,000,000 VND",
      desc: "Mỗi giờ là chi phí trung bình cho một buổi trị liệu tâm lý tại Việt Nam.",
      icon: <ChartBarSquareIcon />,
    },
    {
      title: "14,000,000 người",
      desc: `Mắc chứng rối loạn tâm thần ở Việt Nam,
nhưng cả nước chỉ có 143 bác sĩ tâm lý lâm sàng và bác sĩ trị liệu tâm lý.
(Sức khỏe & đời sống)`,
      icon: <CursorArrowRaysIcon />,
    },
  ],
};

const benefitTwo = {
  title: "Offer more benefits here",
  desc: "You can use this same layout with a flip image to highlight your rest of the benefits of your product. It can also contain an image or Illustration as above section along with some bullet points.",
  image: "/image/benefit-two.png",
  bullets: [
    {
      title: "Mobile Responsive Template",
      desc: "Nextly is designed as a mobile first responsive template.",
      icon: <DevicePhoneMobileIcon />,
    },
    {
      title: "Powered by Next.js & TailwindCSS",
      desc: "This template is powered by latest technologies and tools.",
      icon: <AdjustmentsHorizontalIcon />,
    },
    {
      title: "Dark & Light Mode",
      desc: "Nextly comes with a zero-config light & dark mode. ",
      icon: <SunIcon />,
    },
  ],
};


export {benefitOne, benefitTwo};
