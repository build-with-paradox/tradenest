"use client";

import { useState } from "react";
import { ProductDetailInterface } from "@/types/productTypes";
import ProductReviews from "../modalsandpopups/ReviewsModal";
import { MdInventory } from "react-icons/md";
import toast from "react-hot-toast";
import { createCartService } from "@/apiservice/cartService";
import axios from "axios";
import UpdateProfile from "../modalsandpopups/UpdateProfile";
import { useAuth } from "../contextapis/authentication/AuthProvider";


type ProductDetailCardProp = {
  product: ProductDetailInterface;
};

const ProductDetailCard: React.FC<ProductDetailCardProp> = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const [showReviews, setShowReviews] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<null | "cart" | "buy">(null);
  
  const handleAddToCart = async () => {
    const result = await createCartService(product?._id)
    if (result.success) {
      toast.success(result.message.message)
    } else {
      toast.error(result.message);
    }
  };

  const handleBuyNow = async () => {
    try {
      const paymentResponse = await axios.post(
        "/api/payment/singlepayment",
        { productId: product._id },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Payment response: ", paymentResponse.data.razorpayOrder);

      const order = paymentResponse?.data.razorpayOrder;

      console.log("Order: ", order)

      if (!order || !order.id) {
        console.error("Razorpay order is undefined or missing ID:", order);
        toast.error("Failed to create Razorpay order. Please try again.");
        return;
      }

      console.log("Razorpay Order ID:", order.id);

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
            productId: product._id,
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

  return (
    <>
      <div className="bg-gray-100 max-w-5xl mx-auto p-6 mt-5 rounded-2xl shadow-sm flex flex-col md:flex-row gap-10">
        {/* Image Section */}
        <div className="flex-1 flex justify-center items-start">
          <img
            src={product.productImage.url}
            alt={product.productName}
            className="rounded-lg max-h-[400px] object-contain mt-10 mix-blend-multiply"
          />
        </div>

        {/* Details Section */}
        <div className="flex-1 flex flex-col">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">{product.productName}</h1>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-sm text-yellow-500">⭐ {product.rating} / 5.0</p>
              <button
                className="text-sm text-blue-500 underline cursor-pointer"
                onClick={() => setShowReviews(true)}
              >
                [ Check Reviews ]
              </button>
            </div>

            <p className="text-gray-700 mb-4">{product.productDescription}</p>
            <div className="mt-4 flex items-center gap-4 bg-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-2xl">
                <MdInventory />
              </div>
              <div>
                <p
                  className={`text-base font-semibold ${Number(product.stock) > 0 ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {Number(product.stock) > 0 ? "In Stock" : "Out of Stock"}
                </p>
                <p className="text-sm text-gray-700">
                  {product.stock} {Number(product.stock) === 1 ? "piece" : "pieces"} available
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-4">{product.delivery}</p>
            <p className="text-3xl text-gray-500 mb-3">₹{product.price.toLocaleString()}</p>
          </div>

          {/* Button Group */}
          <div className="flex gap-4 mt-3">
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

      {showReviews && (
        <ProductReviews
          product={product}
          onClose={() => setShowReviews(false)}
        />
      )}

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

export default ProductDetailCard;
