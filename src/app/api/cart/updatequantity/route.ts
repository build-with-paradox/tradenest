import { mongooseConnection } from "@/lib/mongooseconnection";
import Cart from "@/models/Cart";
import Users from "@/models/Users";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";


interface Product {
  productId: mongoose.Types.ObjectId;
  productImage: string;
  productName: string;
  price: number;
  quantity_buyed: number;
  _id: mongoose.Types.ObjectId;
}


export const PUT = async (req: NextRequest) => {
  try {
    await mongooseConnection();

    const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized access, please sign in" }, { status: 401 });
    }

    const user = await Users.findById(sessionToken.id).select("-password -verification_code_expires -provider");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "buyer") {
      return NextResponse.json({ error: "You can't perform this action" }, { status: 403 });
    }

    const { productId, action } = await req.json();

    console.log("productId: ", productId)
    console.log("action: ", action)

    if (!productId || !["increase", "decrease"].includes(action)) {
      return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
    }

    const cart = await Cart.findOne({ user: sessionToken.id });

    if (!cart) {
      return NextResponse.json({ error: "No cart associated with user." }, { status: 404 });
    }

    // Find the index of the product in the cart
    const productIndex = cart.products.findIndex((product: Product) => product.productId.toString() === productId);

    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found in cart." }, { status: 404 });
    }

    if (action === "increase") {
      cart.products[productIndex].quantity_buyed += 1;
    } else if (action === "decrease") {
      cart.products[productIndex].quantity_buyed -= 1;

      if (cart.products[productIndex].quantity_buyed <= 0) {
        // Remove the product from cart if the quantity is 0 or less
        cart.products.splice(productIndex, 1);
      }
    }

    await cart.save();

    return NextResponse.json({ message: "Cart updated", cart }, { status: 200 });

  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
