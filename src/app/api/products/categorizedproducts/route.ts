import { NextRequest, NextResponse } from "next/server";
import ProductRating from "@/models/ProductRating";
import { mongooseConnection } from "@/lib/mongooseconnection";
import Product from "@/models/Products";


export const GET = async (req: NextRequest) => {
  try {
    await mongooseConnection();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const productSearch = searchParams.get("productSearch");

    const query: any = {
      approved: true,
      is_featured: true,
    };

    if (productSearch) {
      query.$or = [
        { productName: { $regex: productSearch, $options: "i" } },
        { productDescription: { $regex: productSearch, $options: "i" } }
      ];
    }

    if (category && category !== "All") {
      query.productCategory = category;
    }

    const products = await Product.find(query).lean();

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

    return NextResponse.json({
      message: productsWithRatings.length > 0 ? "Your featured Products" : "No Products found",
      products: productsWithRatings,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Oops, some server error occurred" },
      { status: 500 }
    );
  }
};
