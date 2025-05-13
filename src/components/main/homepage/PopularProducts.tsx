"use client";

import ProductCard from "@/components/ui/ProductCard";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProductInterface } from "@/types/productTypes";
import { getPopularProductsService } from "@/apiservice/productService";
import DeliveryLoader from "@/components/loaders/loader";

const PRODUCTS_PER_PAGE = 6;

const PopularProducts = () => {
  const [page, setPage] = useState(1);
  const [popularProducts, setPopularProducts] = useState<ProductInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  const getPopularProducts = async () => {
    setLoading(true); // Set loading to true when the data starts fetching
    const response = await getPopularProductsService();
  
    if (response.success) {
      const normalizedProducts = response.data.popularProducts.map((product: any) => ({
        ...product,
        id: product._id,
      }));
  
      setPopularProducts(normalizedProducts);
    }
    setLoading(false); // Set loading to false when data is fetched
  };

  useEffect(() => { 
    getPopularProducts();
  }, []);

  const totalPages = Math.ceil(popularProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = popularProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  return (
    <div className="bg-gray-100 shadow-xs rounded-xl max-w-[72rem] w-full mx-auto px-4 py-6 mt-6">
      <h1 className="text-2xl font-bold text-gray-900 ml-3">Popular Products</h1>
      <p className="text-sm text-gray-600 mt-2 ml-3 mb-6">
        Here's a snapshot of{" "}
        <span className="text-gray-900 font-semibold">Popular Products</span> people are buying frequently.
      </p>

      {/* Show loader when loading */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <DeliveryLoader />
        </div>
      ) : (

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {paginatedProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
        
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-1.5 text-sm rounded-md bg-blue-200 text-blue-800 hover:bg-blue-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm font-medium text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-1.5 text-sm rounded-md bg-blue-200 text-blue-800 hover:bg-blue-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PopularProducts;
