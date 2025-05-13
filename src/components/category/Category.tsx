"use client";

import React, { useEffect, useState } from 'react';
import ProductCard from '../ui/ProductCard';
import { ProductInterface } from '@/types/productTypes';
import { getCategorizedProductsService } from '@/apiservice/productService';
import { motion } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";
import DeliveryLoader from '../loaders/loader';

interface CategoryProps {
    category: string;
    search: string | null;
}

const PRODUCTS_PER_PAGE = 6;

const Category: React.FC<CategoryProps> = ({ category, search }) => {
    const [products, setProducts] = useState<ProductInterface[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState<boolean>(true);

    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

    const getCategorizedProducts = async () => {
        setLoading(true);
        const result = await getCategorizedProductsService(category, search);
        if (result?.success) {
            setProducts(result.products);
        } else {
            setProducts([]);
        }
        setLoading(false);
    };

    const paginatedProducts = products.slice(
        (page - 1) * PRODUCTS_PER_PAGE,
        page * PRODUCTS_PER_PAGE
    );

    useEffect(() => {
        getCategorizedProducts();
    }, [category, search]);

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="bg-gray-100 shadow-xs rounded-xl max-w-[72rem] w-full mx-auto px-4 py-6 mt-6">
                <h1 className="text-3xl font-bold text-gray-900 ml-3">
                    🛍️ Explore {category === "All" ? "All" : `${category} based`} Products
                </h1>
                <p className="text-base text-gray-600 mt-2 ml-3 mb-6">
                    Your Results for <b>"{search}"</b>
                    <span className="text-gray-900 font-semibold ml-1">Trade Nest Shop</span>.
                </p>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center mt-10 mb-16">
                        <DeliveryLoader />
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6"
                        >
                            {paginatedProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>

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
                    </>
                ) : (
                    <motion.div
                        className="flex flex-col items-center justify-center mt-16 mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <FiShoppingCart size={64} className="text-blue-300 mb-4 animate-bounce" />
                        <h2 className="text-xl font-semibold text-gray-700">No products found</h2>
                        <p className="text-gray-500 mt-1">Try a different search or category.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Category;
