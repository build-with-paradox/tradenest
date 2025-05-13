import { NextRequest, NextResponse } from "next/server";
import Cart from "@/models/Cart";
import Users from "@/models/Users";
import Product from "@/models/Products";
import { mongooseConnection } from "@/lib/mongooseconnection";
import { getToken } from "next-auth/jwt";

export const POST = async (req: NextRequest) => {
  try {
    await mongooseConnection();

    const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!sessionToken) {
      return NextResponse.json({ message: "Unauthorized access, please sign in" }, { status: 401 });
    }


    const user = await Users.findById(sessionToken.id).select("-password -verification_code_expires -provider");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.role !== "buyer") {
      return NextResponse.json({ message: "You can't perform this action" }, { status: 403 });
    }

    const { productId } = await req.json();

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    if (product.stock < 1) {
      return NextResponse.json({ message: "Product out of stock" }, { status: 400 });
    }

    let cart = await Cart.findOne({ user: user._id });

    if (cart) {
      const existingProduct = cart.products.find(
        (item: any) => item.productId.toString() === productId
      );

      if (existingProduct) {
        const newQuantity = existingProduct.quantity_buyed + 1;

        if (newQuantity > product.stock) {
          return NextResponse.json({ message: "Not enough stock available" }, { status: 400 });
        }

        existingProduct.quantity_buyed = newQuantity;
      } else {
        cart.products.push({
          productId: product._id,
          productName: product.productName,
          productImage: product.productImage.url,
          price: product.price,
          quantity_buyed: 1,
        });
      }

      await cart.save();
    } else {
      cart = await Cart.create({
        user: user._id,
        products: [
          {
            productId: product._id,
            productName: product.productName,
            productImage: product.productImage.url,
            price: product.price,
            quantity_buyed: 1,
          },
        ],
      });
    }

    return NextResponse.json({ message: "Product added to cart", cart: cart }, { status: 200 });

  } catch (error) {
    console.log("Error adding to cart:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};
