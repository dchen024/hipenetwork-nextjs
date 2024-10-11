"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <>
      <section className="pb-20 overflow-hidden pt-35 md:pt-40 xl:pb-25 xl:pt-46">
        <div className="px-4 mx-auto max-w-c-1390 md:px-8 2xl:px-0">
          <div className="flex lg:items-center lg:gap-8 xl:gap-32.5">
            <div className=" md:w-1/2">
              {/* <h4 className='mb-4.5 text-lg font-medium text-black dark:text-white'>
                Text
              </h4> */}
              <h1 className="pr-16 mb-5 text-3xl font-bold text-black dark:text-white xl:text-hero ">
                HIPE Network
              </h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Dolorum voluptates atque accusamus quam asperiores dolor
                officiis numquam culpa deserunt. Facere, corrupti nobis pariatur
                voluptates architecto ipsum optio obcaecati accusantium.
                Dignissimos?
              </p>

              <div className="mt-10">
                <Link
                  href="/signup"
                  aria-label="get started button"
                  className="inline-block rounded-full bg-black px-7.5 py-2.5 text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho"
                >
                  Get Started
                </Link>
              </div>
            </div>

            <div className="hidden animate_right md:w-1/2 lg:block">
              <div className="relative 2xl:-mr-7.5">
                <Image
                  src="/images/shape/shape-01.png"
                  alt="shape"
                  width={46}
                  height={246}
                  className="absolute -left-11.5 top-0"
                />
                <Image
                  src="/images/shape/shape-02.svg"
                  alt="shape"
                  width={36.9}
                  height={36.7}
                  className="absolute bottom-0 right-0 z-10"
                />
                <Image
                  src="/images/shape/shape-03.svg"
                  alt="shape"
                  width={21.64}
                  height={21.66}
                  className="absolute -right-6.5 bottom-0 z-1"
                />
                <div className=" relative aspect-[700/444] w-full">
                  <Image
                    className="shadow-solid-l dark:hidden"
                    src="/images/hero/hero-light.svg"
                    alt="Hero"
                    fill
                  />
                  <Image
                    className="hidden shadow-solid-l dark:block"
                    src="/images/hero/hero-dark.svg"
                    alt="Hero"
                    fill
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
