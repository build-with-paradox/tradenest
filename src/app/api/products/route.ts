import { NextResponse } from "next/server";
import Product from "@/models/Products";
import { mongooseConnection }  from "@/lib/mongooseconnection"

export const GET = async () => {
  try {

    await mongooseConnection()
    const products = await Product.find({ approved: true });

    return NextResponse.json(
      {
        success: true,
        message: products.length > 0 ? "Your Products" : "No Products found",
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { success: false, error: "Oops, some server error occurred" },
      { status: 500 }
    );
  }
};
