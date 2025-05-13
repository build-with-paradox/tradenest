"use client";

import { useSearchParams, useParams } from 'next/navigation';
import React from 'react';
import Category from '@/components/category/Category';

const CategoryPage: React.FC = () => {
  const { selectedcategory } = useParams<{ selectedcategory: string }>();
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || "";

  const decodedCategory = decodeURIComponent(selectedcategory);

  return (
    <>
      <Category category={decodedCategory} search={search} />
    </>
  );
};

export default CategoryPage;
