import Image from "next/image";
export const Hero = () => {
  return (
    <>
      <div className="flex flex-wrap ">
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8">
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-white lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
              vmind hiểu thấu
            </h1>
            <p className="py-5 text-xl leading-normal text-white lg:text-xl xl:text-2xl dark:text-gray-300">
              Liệu pháp tâm lý dễ
              tiếp cận, cá nhân hóa
              để nuôi dưỡng tâm
              trí bạn.
            </p>

            <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
              <a
                href="#"
                target="_blank"
                rel="noopener"
                className="px-8 py-4 text-lg font-medium text-center text-white bg-[#54A57A] rounded-md flex items-center justify-center space-x-2">
                <span>Tải ứng dụng ngay</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
              <a
                target="_blank"
                rel="noopener"
                className="flex items-center space-x-2 text-white dark:text-gray-400">
                <Image
                  src="/image/vmind-logo.svg"
                  alt="vmind"
                  width={190}
                  height={65}
                />
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full lg:w-1/2">
          <div className="">
            <Image
              src="/image/banner.png"
              width="500"
              height="530"
              className={"object-cover rounded-lg"}
              alt="Hero Illustration"
              loading="eager"
            />
          </div>
        </div>
      </div>

    </>
  );
};
