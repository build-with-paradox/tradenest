import { NextRequest, NextResponse } from "next/server";
import User from "@/models/Users"; 
import { getToken } from "next-auth/jwt";

export const GET = async (req: NextRequest) => {
  try {
    const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized access, please sign in" }, { status: 401 });
    }

    const userId = sessionToken.id;

    const user = await User.findById(userId).select("-password -role -verification_code_expires -provider");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User profile retrieved successfully", user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
