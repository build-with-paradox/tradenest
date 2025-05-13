import { NextRequest, NextResponse } from "next/server";
import User from "@/models/Users";
import { getToken } from "next-auth/jwt";

export const PUT = async (req: NextRequest) => {
  try {

    const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized access, please sign in" }, { status: 401 });
    }

    const { username, email, phone, address } = await req.json();

    const user = await User.findById( sessionToken.id );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    await user.save();

    return NextResponse.json({ message: "Profile updated successfully", user }, { status: 200 });

  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
