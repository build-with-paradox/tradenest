import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getToken } from "next-auth/jwt";
import Order from "@/models/Order";
import { mongooseConnection } from "@/lib/mongooseconnection";
import User from "@/models/Users";
import Product from "@/models/Products";
import Bill from "@/models/Bill";

export async function POST(req: NextRequest) {
    try {
        await mongooseConnection();

        const body = await req.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            productId,
        } = body;

        const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!sessionToken || !sessionToken.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET!)
            .update(sign.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
        }

        console.log("Product Id: ", productId)
        const product = await Product.findById(productId)

        console.log("Product: ", product)

        const products = [{
            productId: product._id, 
            productName: product.productName,  
            productImage: product.productImage.url,
            price: product.price, 
            quantity_buyed: 1,  
        }];
        

        const user = await User.findById(sessionToken.id).select('-password')

        if (user) {
            if (!user.address) {
                return NextResponse.json({
                    success: false,
                    message: "Please setup your address before Checkout",
                    user: user
                })
            }
        }

        const price = product.price;
        const gstPercent = 18;

        const gstAmount = (price * gstPercent) / 100;

        const totalAmount = Math.round(price + gstAmount);

        const bill = await Bill.create({
            user: sessionToken.id,
            product: product._id,
            subtotal: product.price,
            isPaid: true,
            paidAt: new Date(),
            gstPercent,
            gstAmount,
            totalAmount,
        });



        const newOrder = new Order({
            user: sessionToken.id,
            products,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            amount: totalAmount,
            delivery_address: user.address
        });

        await newOrder.save();

        await bill.save()

        return NextResponse.json({ success: true, message: "Order placed successfully" });

    } catch (error) {
        console.error("Order verification & saving error:", error);
        return NextResponse.json({ error: "Something went wrong during verification" }, { status: 500 });
    }
}
