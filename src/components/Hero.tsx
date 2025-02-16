import Image from "next/image";
export const Hero = () => {
  return (
    <>
      <div className="flex flex-wrap ">
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8">
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-white lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
              Vmind hiểu thấu
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
                className="px-8 py-4 text-lg font-medium text-center text-white bg-[#54A57A] rounded-md ">
                Download for Free
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
              className={"object-cover"}
              alt="Hero Illustration"
              loading="eager"
            />
          </div>
        </div>
      </div>

    </>
  );
};
