import { NextRequest, NextResponse } from "next/server";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Products";
import Users from "@/models/Users";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

export const POST = async (req: NextRequest) => {
  try {
    const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized access, please sign in" }, { status: 401 });
    }

    const user = await Users.findById(sessionToken.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid or missing product ID" }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let wishlist = await Wishlist.findOne({ user: user._id });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: user._id,
        products: [productId],
      });
      await wishlist.save();
      return NextResponse.json({ message: "Product added to wishlist", wishlist }, { status: 200 });
    }

    const productIndex = wishlist.products.indexOf(productId);

    if (productIndex > -1) {
      wishlist.products.splice(productIndex, 1);
      await wishlist.save();
      return NextResponse.json({ message: `${product.productName} removed from wishlist`, wishlist }, { status: 200 });
    } else {
      wishlist.products.push(productId);
      await wishlist.save();
      return NextResponse.json({ message: `${product.productName} added to wishlist`, wishlist }, { status: 200 });
    }

  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
