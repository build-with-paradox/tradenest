"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

type BannerProps = {
  title: string;
  subtitle?: string;
  image: string;
  alt?: string;
  ctaText?: string;
  href?: string;
  position?: "left" | "right";
};

const Banner: React.FC<BannerProps> = ({
  title,
  subtitle,
  image,
  alt = "Banner Image",
  ctaText = "Explore Now",
  href = "#",
  position = "right",
}) => {
  const isImageLeft = position === "left";

  return (
    <div className="w-full bg-gray-50 py-6 px-4 md:px-8 rounded-3xl shadow-sm overflow-hidden">
      <div
        className={`max-w-6xl mx-auto flex flex-col-reverse md:flex-row ${
          isImageLeft ? "md:flex-row-reverse" : ""
        } items-center gap-6 md:gap-10`}
      >
        {/* Text Section */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm md:text-base text-gray-700 mb-4">
              {subtitle}
            </p>
          )}
          <Link href={href}>
            <button className="inline-block px-5 py-2 bg-blue-200 text-blue-600 text-sm rounded-full transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer">
              {ctaText}
            </button>
          </Link>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 h-[180px] md:h-[240px] relative">
          <Image
            src={image}
            alt={alt}
            fill
            className="object-contain mix-blend-multiply"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
