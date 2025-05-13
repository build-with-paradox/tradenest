"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Banner from "@/components/ui/Banner";

const BottomBanner: React.FC = () => {
  const banner = {
    id: 99,
    image: "https://m.media-amazon.com/images/I/51ytkakeW5L._SX466_.jpg",
    alt: "Gaming Sale",
    title: "Epic Gaming Fest",
    subtitle: "Unleash your inner gamer with the hottest gear & deals 🎮",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-5 bg-gray-100 text-white rounded-xl shadow-sm overflow-hidden relative">
      <Banner
        title={banner.title}
        subtitle={banner.subtitle}
        image={banner.image}
        alt={banner.alt}
        ctaText="Shop Gaming Deals"
        href={`category/Softwares and Games`}
        position="right"
      />

    </div>
  );
};

export default BottomBanner;
