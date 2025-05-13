"use client";

import ProductCard from "@/components/ui/ProductCard";
import React, { useEffect, useState } from "react";
import { ProductInterface } from "@/types/productTypes";
import { getAvailableProducts } from "@/apiservice/productService";
import { motion } from "framer-motion";
import DeliveryLoader from "@/components/loaders/loader";

const PRODUCTS_PER_PAGE = 6;

const Shop = () => {
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState<ProductInterface[]>([]);
    const [loading, setLoading] = useState(true);

    const getAllProducts = async () => {
        setLoading(true);
        const result = await getAvailableProducts();
        if (result.success && Array.isArray(result.product)) {
            const mappedProducts: ProductInterface[] = result.product.map((item: any) => ({
                id: item._id,
                productName: item.productName,
                productDescription: item.productDescription,
                productImage: {
                  url: item.productImage?.url || ""
                },
                price: item.price,
                rating: item.rating || 0.0,
            }));
            setProducts(mappedProducts);
        }
        setLoading(false);
    };

    useEffect(() => {
        getAllProducts();
    }, []);

    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
    const paginatedProducts = products.slice(
        (page - 1) * PRODUCTS_PER_PAGE,
        page * PRODUCTS_PER_PAGE
    );

    return (
        <div className="bg-gray-100 shadow-xs rounded-xl max-w-[72rem] w-full mx-auto px-4 py-6 mt-6">
            <h1 className="text-3xl font-bold text-gray-900 ml-3">🛍️ Explore the Trade Nest Marketplace</h1>
            <p className="text-base text-gray-600 mt-2 ml-3 mb-6">
                Discover a curated collection of top products, best suited for you at{" "}
                <span className="text-gray-900 font-semibold">Trade Nest Shop</span>.
            </p>

            {loading ? (
                <DeliveryLoader/>
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
                            transition={{ duration: 0.5 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Pagination Controls */}
            {!loading && (
                <div className="flex justify-center mt-8 space-x-2">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ backgroundColor: "#d1d5db" }}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
                    >
                        Previous
                    </motion.button>
                    <span className="self-center font-medium text-gray-700">
                        Page {page} of {totalPages}
                    </span>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ backgroundColor: "#d1d5db" }}
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
                    >
                        Next
                    </motion.button>
                </div>
            )}
        </div>
    );
};

export default Shop;
