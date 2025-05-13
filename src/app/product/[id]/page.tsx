"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Product_Detail from '@/components/main/product/Product_Detail';

const ProductDetail = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  if (!id) {
    return <p>Invalid product ID</p>;
  }

  return (
    <>
      <Product_Detail productId={id} />
    </>
  );
};

export default ProductDetail;
