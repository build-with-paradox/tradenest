import { NextResponse } from "next/server";
import Order from "@/models/Order";
import Product from "@/models/Products";
import ProductRating from "@/models/ProductRating";
import { mongooseConnection } from "@/lib/mongooseconnection";

export const GET = async () => {
  try {
    await mongooseConnection();

    const orders = await Order.find({}, "products");

    const productCountMap = new Map();

    orders.forEach(order => {
      order.products.forEach((product: any) => {
        const id = product.productId.toString();
        productCountMap.set(id, (productCountMap.get(id) || 0) + 1);
      });
    });

    const sortedProducts = Array.from(productCountMap.entries())
      .sort((productA, productB) => {
        const countA = productA[1];
        const countB = productB[1];
        return countB - countA;
      })
      .slice(0, 10);

    const popularProductIds = sortedProducts.map(([productId]) => productId);

    const popularProducts = await Product.find({ _id: { $in: popularProductIds } });

    const ratings = await ProductRating.aggregate([
      { $match: { product: { $in: popularProductIds } } }, 
      {
        $group: {
          _id: "$product", 
          averageRating: { $avg: "$rating" }, 
          totalRatings: { $sum: 1 }, 
        }
      }
    ]);

    const productRatingsMap = ratings.reduce((acc, rating) => {
      acc[rating._id.toString()] = {
        averageRating: rating.averageRating,
        totalRatings: rating.totalRatings,
      };
      return acc;
    }, {});

    const popularProductsWithRatings = popularProducts.map(product => {
      const productId = product._id.toString();
      const rating = productRatingsMap[productId] || { averageRating: 0, totalRatings: 0 };

      return {
        ...product.toObject(),
        averageRating: rating.averageRating,
        ratings: rating.totalRatings,
      };
    });

    return NextResponse.json({ popularProducts: popularProductsWithRatings }, { status: 200 });

  } catch (error) {
    console.error("Error fetching popular products:", error);
    return NextResponse.json({ error: "Failed to fetch popular products" }, { status: 500 });
  }
};
