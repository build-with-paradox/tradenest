import { NextRequest, NextResponse } from "next/server";
import ProductRating from "@/models/ProductRating";
import { getToken } from "next-auth/jwt";
import { mongooseConnection } from "@/lib/mongooseconnection";
import Product from "@/models/Products";


export const GET = async () => {
  try {
    await mongooseConnection();
    
    const products = await Product.find({
      approved: true,
      is_featured: true,
    }).lean();

    const productsWithRatings = await Promise.all(
      products.map(async (product) => {
        const ratings = await ProductRating.aggregate([
          { $match: { product: product._id } },
          { $group: { _id: null, avgRating: { $avg: "$rating" } } },
        ]);

        product.rating = ratings.length > 0 ? ratings[0].avgRating : 0;

        return {
          id: product._id,
          productImage: product.productImage,
          productName: product.productName,
          productDescription: product.productDescription,
          price: product.price,
          rating: product.rating,
          stock: product.stock,
        };
      })
    );

    if (productsWithRatings.length > 0) {
      return NextResponse.json(
        { message: "Your featured Products", products: productsWithRatings },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No Products found", products: [] },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Oops, some server error occurred" },
      { status: 500 }
    );
  }
};
