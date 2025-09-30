"use client";

import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  LogIn,
  LogOut,
  ChevronDown,
  Heart,
  UserCircle,
  Package,
} from "lucide-react";
import { CiUser } from "react-icons/ci";
import { IoStorefrontOutline } from "react-icons/io5";
import { BsShop } from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";
import { Listbox, Menu, Transition } from "@headlessui/react";
import { useAuth } from "../contextapis/authentication/AuthProvider";

const categories = ["All", "Clothing", "Footwear", "Electronics", "Softwares and Games", "Books", "Accessories"];

const NavBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const router = useRouter();
  const cartCount = 3;

  const { isAuthenticated, logout, user } = useAuth();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search submission
  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const encodedCategory = encodeURIComponent(selectedCategory);
      const query = searchTerm.trim() ? `?search=${encodeURIComponent(searchTerm)}` : "";
      router.push(`/category/${encodedCategory}${query}`);
      setSearchTerm("");
    }
  };
  

  return (
    <nav className={`w-full sticky top-0 z-50 backdrop-blur-md border-b rounded-xl bg-gray-50 border-gray-200 ${isScrolled ? "shadow-xl" : "shadow-none"} transition-shadow duration-300`}>
      <div className="max-w-7xl mx-auto -mb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 w-24 h-24 rounded-2xl overflow-hidden -mt-5">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/trade_nest.png"
                alt="Trade Nest"
                width={150}
                height={150}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* Category and Search */}
          <div className="flex w-full max-w-3xl mx-auto items-center gap-2">
            <div className="relative w-fit">
              <Listbox value={selectedCategory} onChange={setSelectedCategory}>
                <div className="relative">
                  <Listbox.Button className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[100px] whitespace-nowrap pr-8">
                    {selectedCategory}
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-50 mt-2 w-max overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-gray-200">
                    {categories.map((category) => (
                      <Listbox.Option
                        key={category}
                        value={category}
                        className={({ active, selected }) =>
                          `cursor-pointer select-none py-2 pl-4 pr-10 ${active ? "bg-blue-50 text-blue-700" : "text-gray-700"} ${selected ? "font-semibold" : "font-normal"}`
                        }
                      >
                        {category}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchSubmit}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="ml-3 shop">
              <Link href="/shop" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-500">
                <BsShop className="w-5 h-5" />
                Shop
              </Link>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-x-6 -ml-10">
            <Link
              href="https://nest-seller.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-gray-600"
            >
              <IoStorefrontOutline className="w-5 h-5" />
              Become a Seller
            </Link>

            {isAuthenticated ? (
              <>
                <Link href="/cart" className="relative">
                  <ShoppingBag className="w-6 h-6 text-gray-500 hover:text-gray-700 hover:scale-105 transition-transform" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="flex items-center focus:outline-none">
                      <CiUser className="w-6 h-6 text-gray-500 hover:text-gray-700 hover:scale-105 transition-transform cursor-pointer" />
                      <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl bg-white shadow-xl ring-1 ring-gray-200 z-50">
                      <div className="py-1 text-sm">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/account"
                              className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"} flex items-center px-4 py-2 gap-2 rounded-lg`}
                            >
                              <UserCircle className="w-4 h-4" />
                              Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/wishlist"
                              className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"} flex items-center px-4 py-2 gap-2 rounded-lg`}
                            >
                              <Heart className="w-4 h-4" />
                              Wishlist
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/order-history"
                              className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"} flex items-center px-4 py-2 gap-2 rounded-lg`}
                            >
                              <Package className="w-4 h-4" />
                              Order History
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"} w-full text-left px-4 py-2 gap-2 flex items-center rounded-lg hover:text-red-500 cursor-pointer`}
                            >
                              <LogOut className="w-4 h-4" />
                              Sign-out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <Link href="/authentication/signin" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-500">
                <LogIn className="w-5 h-5" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};


export default NavBar ;
