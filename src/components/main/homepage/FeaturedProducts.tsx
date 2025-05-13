"use client";

import ProductCard from "@/components/ui/ProductCard";
import React, { useEffect, useState } from "react";
import DeliveryLoader from "@/components/loaders/loader";
import { motion } from "framer-motion";
import { ProductInterface } from "@/types/productTypes";
import { getFeaturedProductsService } from "@/apiservice/productService";


const PRODUCTS_PER_PAGE = 6;

const FeaturedProducts = () => {
    const [page, setPage] = useState(1);
    const [ featuredProducts, setFeaturedProducts ] = useState<ProductInterface[]>([])
    const [loading, setLoading] = useState<boolean>(true); // Add loading state


    const totalPages = Math.ceil(featuredProducts.length / PRODUCTS_PER_PAGE);

    const paginatedProducts = featuredProducts.slice(
        (page - 1) * PRODUCTS_PER_PAGE,
        page * PRODUCTS_PER_PAGE
    );

    const getFeaturedProducts = async()=> { 
      setLoading(true); // Set loading to true when the data starts fetching
      const result = await getFeaturedProductsService()

      if(result?.success){ 
        console.log("trade nest featured products: ", result.products)
        setFeaturedProducts(result.products)
      }
      setLoading(false);
    }

    useEffect(()=> { 
      getFeaturedProducts()
    }, [])
    return (
        <div className="bg-gray-100 shadow-xs rounded-xl max-w-[72rem] w-full mx-auto px-4 py-6 mt-6">
            <h1 className="text-2xl font-bold text-gray-900 ml-3">Featured Products</h1>
            <p className="text-sm text-gray-600 mt-2 ml-3 mb-6">
                Browse our <span className="text-gray-900 font-semibold">Featured Products</span> — handpicked and promoted by top sellers and brands.
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
                <ProductCard key={product.id} product={product} />
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

export default FeaturedProducts;
