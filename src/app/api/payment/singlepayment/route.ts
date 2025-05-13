import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getToken } from "next-auth/jwt";
import Bill from "@/models/Bill";
import User from "@/models/Users";
import { mongooseConnection } from "@/lib/mongooseconnection";
import Product from "@/models/Products";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY!,
    key_secret: process.env.RAZORPAY_SECRET!,
});

export const POST = async (req: NextRequest) => {
    try {
        await mongooseConnection();

        const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!sessionToken || !sessionToken.sub) {
            return NextResponse.json({ error: "Unauthorized access, please sign in" }, { status: 401 });
        }

        const user = await User.findById(sessionToken.id).select("-password");

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (!user.address || user.address === "") {
            return NextResponse.json({
                message: "Please setup your address before Checkout",
                user: user
            }, { status: 401 });
        }

        if (!user.phone || user.phone === null || user.phone === "") {
            return NextResponse.json({
                message: "Please setup your phone before Checkout",
                user: user
            }, { status: 401 });
        }

        const { productId } = await req.json();
        console.log("productId: ", productId)
        const product = await Product.findById(productId);

        console.log("product: ", product)
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        if (product.stock < 1) {
            return NextResponse.json({ message: "Product out of stock" }, { status: 400 });
        }

        const price = product.price;
        const gstPercent = 18;

        const gstAmount = (price * gstPercent) / 100;

        const totalAmount = Math.round(price + gstAmount);

        const razorpayOrder = await razorpay.orders.create({
            amount: totalAmount * 100, 
            currency: "INR",
            receipt: `order_rcptid_${Date.now()}`,
        });
        return NextResponse.json({
            message: "Order created successfully",
            razorpayOrder,
        });
    } catch (error) {
        console.error("Order save error:", error);
        return NextResponse.json({ error: "Server error while saving order" }, { status: 500 });
    }
};
