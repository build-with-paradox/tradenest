import { NextRequest, NextResponse } from "next/server";
import Cart from "@/models/Cart";
import Users from "@/models/Users"; // Fixed import
import { mongooseConnection } from "@/lib/mongooseconnection";
import { getToken } from "next-auth/jwt";

export const GET = async (req: NextRequest) => {
  try {
    await mongooseConnection(); 

    const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized access, please sign in" }, { status: 401 });
    }

    const user = await Users.findById(sessionToken.id).select("-password -role -verification_code_expires -provider");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return NextResponse.json({ message: "Cart is empty", cart: [] }, { status: 200 });
    }

    return NextResponse.json({ cart: cart }, { status: 200 });

  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
