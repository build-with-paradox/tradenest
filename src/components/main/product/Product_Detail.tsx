"use client";

import React, { useEffect, useState } from 'react';
import ProductDetailCard from '@/components/ui/ProductDetail';
import { ProductDetailInterface } from '@/types/productTypes';
import { getProductDetail } from '@/apiservice/productService';
import DeliveryLoader from '@/components/loaders/loader';

interface Props {
  productId: string;
}

const Product_Detail: React.FC<Props> = ({ productId }) => {
  const [productDetail, setProductDetail] = useState<ProductDetailInterface | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductDetail(productId);
        setProductDetail(response?.productDetail);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  if (!productDetail) return <div className="flex justify-center items-center mt-10 mb-16">
  <DeliveryLoader />
</div>;

  return <ProductDetailCard product={productDetail} />;
};

export default Product_Detail;
