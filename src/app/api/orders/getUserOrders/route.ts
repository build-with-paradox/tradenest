import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Orders from "@/models/Order";
import { mongooseConnection } from "@/lib/mongooseconnection";

export const GET = async (req: NextRequest) => {
  try {
    await mongooseConnection();

    const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!sessionToken || !sessionToken.sub) {
      return NextResponse.json({ error: "Unauthorized access, please sign in" }, { status: 401 });
    }

    const userOrders = await Orders.find({ user: sessionToken.id });

    if (userOrders.length > 0) {
      return NextResponse.json({ message: "Orders associated with you", orders: userOrders }, { status: 200 });
    } else {
      return NextResponse.json({ message: "No orders found", orders: [] }, { status: 200 });
    }
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json({ error: "Server error while retrieving orders" }, { status: 500 });
  }
};
