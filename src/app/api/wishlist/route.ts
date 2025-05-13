import { NextRequest, NextResponse } from "next/server";
import Wishlist from "@/models/Wishlist";
import Users from "@/models/Users";
import { getToken } from "next-auth/jwt";

export const GET = async (req: NextRequest) => {
  try {
    const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized access, please sign in" }, { status: 401 });
    }

    const user = await Users.findById(sessionToken.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const wishlist = await Wishlist.findOne({ user: user._id }).populate({
      path: "products",
      select: "productName productImage price"
    });

    if (!wishlist || wishlist.products.length === 0) {
      return NextResponse.json({ message: "Wishlist is empty", wishlist: [] }, { status: 200 });
    }

    return NextResponse.json({ wishlist: wishlist.products }, { status: 200 });

  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
