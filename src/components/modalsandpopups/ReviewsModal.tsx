"use client";

import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";

interface ProductReviewsProps {
  username: string;
  star: number;
  review: string;
}

interface ProductCardProps {
  _id: string;
  productImage: { url: string };
  productName: string;
  productDescription: string;
  price: number;
  rating: number;
  reviews?: ProductReviewsProps[];
}

interface ProductReviewDetailsProps {
  product: ProductCardProps;
  onClose: () => void;
}

const ProductReviews: React.FC<ProductReviewDetailsProps> = ({ product, onClose }) => {
  const reviews = product.reviews || [];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 backdrop-blur-md z-50">
      <div className="bg-white shadow-2xl rounded-3xl w-[90%] md:w-[80%] h-[90vh] relative flex">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 cursor-pointer transition"
        >
          <AiOutlineClose size={24} />
        </button>

        {/* Left Side - Product Info */}
        <div className="w-full md:w-1/2 p-6 border-r border-gray-200 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
          <img
            src={product.productImage.url}
            alt={product.productName}
            className="w-48 h-48 mb-4 rounded-xl shadow-md"
          />
          <h2 className="text-2xl font-bold text-gray-900">{product.productName}</h2>
          <p className="text-sm text-gray-600 mt-2 text-center">{product.productDescription}</p>
          <p className="text-xl text-gray-800 mt-4 font-semibold">₹{product.price}</p>
          <div className="flex items-center gap-1 text-yellow-500 mt-2">
            <FaStar />
            <span className="font-medium text-gray-800">{product.rating || 0} / 5</span>
          </div>
        </div>

        {/* Right Side - Reviews */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto max-h-full bg-white">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Reviews</h3>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-gray-800 font-medium">{review.username}</div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${review.star >= 4
                          ? "bg-green-100 text-green-600"
                          : review.star === 3
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                        }`}
                    >
                      ⭐ {review.star}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{review.review}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-12">
              <MdRateReview className="text-4xl md:text-5xl text-gray-300 mb-3" />
              <p className="text-lg font-medium">No reviews yet</p>
              <p className="text-sm text-gray-400">Be the first one to leave a review after delivery</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
