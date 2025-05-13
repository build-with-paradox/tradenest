import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { ProductInterface } from "@/types/productTypes";
import toast from "react-hot-toast";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import { createCartService } from "@/apiservice/cartService";
import { getWishListService, switchWishlistService } from "@/apiservice/wishlistService";
import axios from "axios";
import UpdateProfile from "../modalsandpopups/UpdateProfile";
import { useAuth } from "../contextapis/authentication/AuthProvider";

const ProductCard: React.FC<{ product: ProductInterface }> = ({ product }) => {
  const { isAuthenticated } = useAuth();

  const [wishlisted, setWishlisted] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<null | "cart" | "buy">(null);
  const [hoveredHeart, setHoveredHeart] = useState(false);

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      const result = await getWishListService();
      const items =
        result?.data?.wishlist?.products || result?.data?.wishlist || [];
      const isWishlisted = items.some((item: any) => item._id === product.id);
      setWishlisted(isWishlisted);
    };

    fetchWishlistStatus();
  }, [product.id]);

  const handleBuyNow = async () => {
    try {
      const paymentResponse = await axios.post(
        "/api/payment/singlepayment",
        { productId: product.id },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const order = paymentResponse?.data.razorpayOrder;

      if (!order || !order.id) {
        console.error("Razorpay order is undefined or missing ID:", order);
        toast.error("Failed to create Razorpay order. Please try again.");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
        amount: order.amount,
        currency: "INR",
        name: "Trade nest",
        description: "Order Payment",
        image: "/assets/trade_nest.png",
        order_id: order.id,
        handler: async function (response: any) {
          toast.success("Payment successful!");
          await axios.post("/api/payment/singlepayment/verifysinglepayment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            productId: product.id,
          });
        },
        prefill: {
          name: user.username,
          email: user.email,
          contact: String(user.phone),
        },
        notes: {
          address: "Trade Nest",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      toast.dismiss();
    } catch (error: any) {
      console.log("Payment error:", error);

      if (
        error.response?.status === 401 &&
        error.response.data.message === "Please setup your address before Checkout"
      ) {
        toast.error("Please setup your delivery address.");
        setUser(error.response.data.user);
        setOpenProfileModal(true);
        return;
      }

      if (
        error.response?.status === 401 &&
        error.response.data.message === "Please setup your phone before Checkout"
      ) {
        toast.error("Please setup your phone before Checkout");
        setUser(error.response.data.user);
        setOpenProfileModal(true);
        return;
      }

      toast.error("Oops! Some error occurred while handling payment.");
    }
  };

  const handleAddToCart = async () => {
    const result = await createCartService(product?.id);
    if (result.success) {
      toast.success(result.message.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleToggleWishlist = async (e: any) => {
    e.preventDefault();
    const result = await switchWishlistService(product.id);

    if (result?.success) {
      toast.success(result.message || "Wishlist updated!", {
        position: "bottom-center",
        icon: <FaHeart color="#8CC3FD" size={30} />,
      });
      setWishlisted((prev) => !prev); // Toggle UI
    } else {
      console.error("Wishlist switch error:", result);
      toast.error(result?.message || "Something went wrong!", {
        position: "bottom-center",
        icon: <FaHeart color="red" size={30} />,
      });
    }
  };

  return (
    <>
      <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition p-4 w-full relative">
        {/* Wishlist Heart */}
        <div
          onMouseEnter={() => !isAuthenticated && setHoveredHeart(true)}
          onMouseLeave={() => setHoveredHeart(false)}
          className="absolute top-4 right-4 z-10"
        >
          <button
            onClick={handleToggleWishlist}
            className="text-gray-400 hover:text-blue-500 cursor-pointer"
            disabled={!isAuthenticated}
          >
            {hoveredHeart && !isAuthenticated ? (
              <FaHeartBroken
                size={20}
                color="#FF5A5F"
                className="transition-all duration-5000 ease-in-out"
              />
            ) : (
              <Heart
                size={20}
                fill={wishlisted ? "#8CC3FD" : "none"}
                stroke={wishlisted ? "#8CC3FD" : "currentColor"}
                className="transition-all duration-5000 ease-in-out"
              />
            )}
          </button>

          {hoveredHeart && !isAuthenticated && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-sm text-white bg-black rounded-md shadow-lg whitespace-nowrap min-w-max">
              Please Sign-in first
            </div>
          )}
        </div>


        <Link href={`/product/${product.id}`} className="block">
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
            <Image
              src={product.productImage?.url || ""}
              alt={product.productName}
              fill
              className="object-contain mix-blend-multiply"
            />
          </div>
          <h3 className="text-lg font-semibold mb-1 truncate">{product.productName}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {product.productDescription}
          </p>
          <div className="flex items-center text-yellow-500 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                stroke="currentColor"
              />
            ))}
            <span className="text-gray-500 text-xs ml-2">
              {product.rating}
            </span>
          </div>
        </Link>

        <div className="flex items-center justify-between mt-4">
          <span className="text-gray-600 font-medium text-lg">₹{product.price}</span>
          <div className="flex gap-2">
            {/* Add to Cart Wrapper */}
            <div
              onMouseEnter={() => !isAuthenticated && setHoveredBtn("cart")}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <button
                onClick={handleAddToCart}
                disabled={!isAuthenticated}
                className={`bg-gray-200 text-sm px-4 py-1.5 rounded-full transition ${!isAuthenticated
                  ? "text-gray-700 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-300"
                  }`}
              > 
                {!isAuthenticated && hoveredBtn === "cart" ? "Sign-in to Add" : "Add to Cart"}
              </button>
            </div>

            {/* Buy Now Wrapper */}
            <div
              onMouseEnter={() => !isAuthenticated && setHoveredBtn("buy")}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <button
                onClick={handleBuyNow}
                disabled={!isAuthenticated}
                className={`bg-blue-200 text-sm px-4 py-1.5 rounded-full transition ${!isAuthenticated
                  ? "text-blue-500 cursor-not-allowed"
                  : "text-blue-500 hover:bg-blue-300"
                  }`}
              >
                {!isAuthenticated && hoveredBtn === "buy" ? "Sign-in to Buy" : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {openProfileModal && (
        <UpdateProfile
          profile={{
            username: user.username,
            email: user.email,
            address: user.address,
            phone: user.phone,
          }}
          onClose={() => setOpenProfileModal(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
