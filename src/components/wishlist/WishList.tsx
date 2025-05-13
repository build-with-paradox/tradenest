"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import { getWishListService, switchWishlistService } from "@/apiservice/wishlistService";
import { createCartService } from "@/apiservice/cartService";
import toast from "react-hot-toast";
import { FaHeart } from "react-icons/fa";

const WishList = () => {
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const getWishlist = async () => {
        try {
            const result = await getWishListService();
            console.log("Result from API:", result);

            if (result?.success && result?.data?.wishlist?.products) {
                setWishlist(result.data.wishlist.products);
            } else if (result?.success && Array.isArray(result?.data?.wishlist)) {
                setWishlist(result.data.wishlist); 
            } else {
                console.warn("Unexpected wishlist format");
                setWishlist([]);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist:", error);
            setWishlist([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getWishlist();
    }, []);

    const handleRemove = async(id: string) => {
        const result = await switchWishlistService(id)
    
        if(result.success){ 
          toast(result.message, {
            position: "bottom-center",
            icon: <FaHeart color="#8CC3FD" size={30}/>
          })
          getWishlist()
        }else{ 
          toast(result.message, {
            position: "bottom-center",
            icon: <FaHeart color="#8CC3FD" size={30}/>
          })
        }
    };

    const handleAddToCart = async(id: string) => {
        const result = await createCartService(id)
    if (result.success) {
      toast.success(result.message.message)
    } else {
      toast.error(result.message);
    }
    };

    return (
        <div className="bg-gray-100 shadow-xs rounded-xl max-w-[72rem] w-full mx-auto px-4 py-6 mt-6">
            <div className="flex">
                <img src="/assets/heart.gif" className="mix-blend-multiply h-10 w-10"/>
                <h2 className="text-3xl font-bold ml-2 mb-8 text-gray-800 tracking-tight">
                    Your Wishlist
                </h2>
            </div>

            {loading ? (
                <p className="text-gray-500 text-center text-lg">Loading wishlist...</p>
            ) : wishlist.length === 0 ? (
                <p className="text-gray-500 text-center text-lg">Your wishlist is empty 💤</p>
            ) : (
                <div className="grid gap-6">
                    {wishlist.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition p-5"
                        >
                            <div className="flex items-center gap-4 ">
                                <div className="relative w-24 h-24 ">
                                    <Image
                                        src={item.productImage?.url}
                                        alt={item.productName}
                                        fill
                                        className="object-contain mix-blend-multiply"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {item.productName}
                                    </h3>
                                    <p className="text-md text-gray-500 mt-1">₹{item.price}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleAddToCart(item._id)}
                                    className="flex items-center gap-2 bg-blue-200 text-blue-500 px-5 py-4 rounded-full text-sm cursor-pointer"
                                >
                                    <ShoppingCart size={16} />
                                    Add to Cart
                                </button>

                                <button
                                    onClick={() => handleRemove(item._id)}
                                    className="flex items-center gap-2 bg-red-200 text-red-500 px-5 py-4 rounded-full text-sm cursor-pointer"
                                    title="Remove from wishlist"
                                >
                                    <Trash2 size={20} />
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishList;
