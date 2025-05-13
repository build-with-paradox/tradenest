import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getToken } from "next-auth/jwt";
import Cart from "@/models/Cart";
import Bill from "@/models/Bill";
import Order from "@/models/Order";
import { mongooseConnection } from "@/lib/mongooseconnection";
import User  from "@/models/Users";

export async function POST(req: NextRequest) {
  try {
    await mongooseConnection();

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cart,
      totalAmount,
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

    const products = cart.map((item: any) => ({
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage,
      price: item.price,
      quantity_buyed: item.quantity_buyed,
    }));

    const activeCart = await Cart.findOne({ user: sessionToken.id });

    if (activeCart) {
      const associatedBill = await Bill.findOne({ cart: activeCart._id });
      if (associatedBill) {
        associatedBill.isPaid = true;
        associatedBill.paidAt = new Date();
        await associatedBill.save();
      }
    }


    await Cart.findOneAndDelete({ user: sessionToken.id });

    const user = await User.findById(sessionToken.id).select('-password')
    
    if(user){ 
      if(!user.address){ 
        return NextResponse.json({ 
          success: false, 
          message: "Please setup your address before Checkout", 
          user: user
        })
      }
    }

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

    return NextResponse.json({ success: true, message: "Order placed successfully" });

  } catch (error) {
    console.error("Order verification & saving error:", error);
    return NextResponse.json({ error: "Something went wrong during verification" }, { status: 500 });
  }
}
