"use client";

import React from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="bg-gray-100 text-gray-700 mt-16 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                {/* Company Info */}
                <div>
                    <div className="flex">
                        <Image
                            src="/assets/trade_nest.png"
                            alt="Trade Nest"
                            width={100} // You can adjust this
                            height={100} // Keep height smaller and consistent
                            className="object-contain mb-5"
                            priority
                        />
                        {/* <h1 className="text-2xl font-bold text-gray-900 mb-3">Trade Nest</h1> */}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Your one-stop shop for everything awesome. Quality products at great prices.
                    </p>
                    <div className="flex space-x-4 text-gray-600">
                        <Link href="#"><FaFacebookF className="hover:text-blue-600 transition text-xl" /></Link>
                        <Link href="#"><FaInstagram className="hover:text-pink-500 transition text-xl" /></Link>
                        <Link href="#"><FaTwitter className="hover:text-blue-400 transition text-xl" /></Link>
                        <Link href="#"><FaLinkedinIn className="hover:text-blue-700 transition text-xl" /></Link>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/" className="hover:text-blue-500 transition">Home</Link></li>
                        <li><Link href="/shop" className="hover:text-blue-500 transition">Shop</Link></li>
                        <li><Link href="/deals" className="hover:text-blue-500 transition">Deals</Link></li>
                        <li><Link href="/categories" className="hover:text-blue-500 transition">Categories</Link></li>
                    </ul>
                </div>

                {/* Help & Support */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Support</h2>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/help" className="hover:text-blue-500 transition">Help Center</Link></li>
                        <li><Link href="/returns" className="hover:text-blue-500 transition">Returns & Refunds</Link></li>
                        <li><Link href="/shipping" className="hover:text-blue-500 transition">Shipping Info</Link></li>
                        <li><Link href="/faq" className="hover:text-blue-500 transition">FAQs</Link></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Join Our Newsletter</h2>
                    <p className="text-sm text-gray-600 mb-3">Get updates on offers, new products & more</p>
                    <form className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="px-4 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            type="submit"
                            className="bg-blue-300 text-blue-500 cursor-pointer text-sm px-4 py-2 rounded-md font-bold"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t py-6 px-6 md:px-0 text-center text-xs text-gray-500">
                <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-4">
                    <p>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
                    <div className="flex gap-4 text-xs">
                        <Link href="/privacy-policy" className="hover:text-blue-500 transition">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-blue-500 transition">Terms of Service</Link>
                        <Link href="/sitemap" className="hover:text-blue-500 transition">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
