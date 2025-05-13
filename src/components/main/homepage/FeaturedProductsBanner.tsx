"use client";

import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";
import Link from "next/link";

type Banner = {
  id: number;
  image: string;
  alt?: string;
  title: string;
  subtitle?: string;
};

const banners: Banner[] = [
  {
    id: 1,
    title: "Smartphone Pro Max",
    subtitle: "Experience next-gen speed and clarity.",
    image:
      "https://m.media-amazon.com/images/I/61qvRagAn9L.__AC_SX300_SY300_QL70_FMwebp_.jpg",
    alt: "Smartphone Pro Max",
  },
  {
    id: 2,
    title: "Stylish Sneakers",
    subtitle: "Walk the talk with ultimate comfort.",
    image: "https://m.media-amazon.com/images/I/71SmobGmakL._AC_SY625_.jpg",
    alt: "Stylish Sneakers",
  },
  {
    id: 3,
    title: "Noise Cancelling Headphones",
    subtitle: "Pure sound, zero distractions.",
    image: "https://m.media-amazon.com/images/I/71PaB9eGccL._AC_SX679_.jpg",
    alt: "Noise Cancelling Headphones",
  },
];

const BannerSlider: React.FC = () => {
  return (
    <div className="max-w-[72rem] w-full mx-auto px-4 py-4 mt-4">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={3000}
        showStatus={false}
        showArrows={false}
        swipeable
        emulateTouch
        renderIndicator={(onClickHandler, isSelected, index, label) => {
          const baseStyle =
            "inline-block w-2 h-2 mx-1 rounded-full transition-all duration-300";
          const selectedStyle = "bg-blue-300 scale-110";
          const unselectedStyle = "bg-gray-400";
          return (
            <span
              key={index}
              className={`${baseStyle} ${
                isSelected ? selectedStyle : unselectedStyle
              }`}
              onClick={onClickHandler}
              aria-label={`Slide ${label}`}
            />
          );
        }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="flex items-center justify-between bg-gray-100 h-[200px] md:h-[350px] w-full rounded-xl overflow-hidden p-4 md:p-8"
          >
            <div className="text-left text-black w-full md:w-1/2 z-10">
              <h2 className="text-xl md:text-3xl font-bold mb-1">
                {banner.title}
              </h2>
              {banner.subtitle && (
                <p className="text-xs md:text-base mb-3">{banner.subtitle}</p>
              )}
              <Link href={`/product/${banner.id}`}>
                <button className="px-4 py-1.5 rounded-full bg-blue-300 text-blue-700 font-medium text-xs md:text-sm hover:bg-blue-500 hover:text-white transition">
                  Order Now
                </button>
              </Link>
            </div>
            <div className="w-1/2 h-full relative hidden md:block">
              <Image
                src={banner.image}
                alt={banner.alt || "Banner Image"}
                layout="fill"
                objectFit="contain"
                className="rounded-lg mix-blend-multiply"
              />
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default BannerSlider;
