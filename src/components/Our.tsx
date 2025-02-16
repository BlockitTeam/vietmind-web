import Image from "next/image";
import React from "react";
import { Container } from "@/components/Container";

import user1 from "../../public/image/user1.png";
import user2 from "../../public/image/user2.png";
import user3 from "../../public/image/user3.png";

export const Our = () => {
    return (
        <Container className="mb-7">
            <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-3">
                <div className="lg:col-span-2 xl:col-auto">
                    <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-10 rounded-2xl py-14 dark:bg-trueGray-800 items-center">
                        <Image src={user1} height={535} width={273} alt="khue" className="border-1 border-solid rounded-md" />
                        <div className="flex flex-col justify-center items-center">
                            <p className="text-2xl mt-5 font-bold">Khue Tran</p>
                            <div className="text-center mt-3">
                                <p>Founder</p>
                                <p>Head of Data</p>
                                <p>@ VNGGames</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 xl:col-auto">
                    <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-10 rounded-2xl py-14 dark:bg-trueGray-800 items-center">
                        <Image src={user2} height={535} width={273} alt="khue" className="border-1 border-solid rounded-md" />
                        <div className="flex flex-col justify-center items-center">
                            <p className="text-2xl mt-5 font-bold">Ryan Nguyen</p>
                            <div className="text-center mt-3">
                                <p>Co-Founder</p>
                                <p>Product Designer</p>
                                <p>@ MongoDB</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 xl:col-auto">
                    <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-10 rounded-2xl py-14 dark:bg-trueGray-800 items-center">
                        <Image src={user3} height={535} width={273} alt="khue" className="border-1 border-solid rounded-md" />
                        <div className="flex flex-col justify-center items-center">
                            <p className="text-2xl mt-5 font-bold">PhD. Cong Tran</p>
                            <div className="text-center mt-3">
                                <p>Chief Advisor Professor at </p>
                                <p>University of Education,</p>
                                <p>VNU, Hanoi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};