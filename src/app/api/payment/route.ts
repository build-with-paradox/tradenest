import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getToken } from "next-auth/jwt";
import Cart from "@/models/Cart";
import Bill from "@/models/Bill";
import User  from "@/models/Users";
import { mongooseConnection } from "@/lib/mongooseconnection";


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY!,
    key_secret: process.env.RAZORPAY_SECRET!,
});


export const POST = async (req: NextRequest) => {
    try {
        await mongooseConnection();

        console.log("razorpay", razorpay)
        const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!sessionToken || !sessionToken.sub) {
            return NextResponse.json({ error: "Unauthorized access, please sign in" }, { status: 401 });
        }

        const user = await User.findById(sessionToken.id).select('-password')

        if (user) {
            if (!user.address || user.address==="") {
                return NextResponse.json({
                    message: "Please setup your address before Checkout",
                    user: user
                }, { status: 401 })
            }

            if(!user.phone || user.phone === null || user.phone === "" ) { 
                console.log("phone : ", user.phone)
                return NextResponse.json({
                    message: "Please setup your phone before Checkout",
                    user: user
                }, { status: 401 })
            }
        }else{ 
            return NextResponse.json({ message: "User Not found" }, { status: 404 })
        }

        const cart = await Cart.findOne({ user: sessionToken.id });
        if (!cart) {
            return NextResponse.json({ error: "No cart found for the user" }, { status: 400 });
        }

        const bill = await Bill.findOne({ cart: cart._id });
        if (!bill) {
            return NextResponse.json({ error: "No bill found for the cart" }, { status: 400 });
        }

        const order = await razorpay.orders.create({
            amount: bill.totalAmount * 100,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
        })

        if (order) {
            return NextResponse.json({ message: "Order created", order_details: order }, { status: 200 })
        } else {
            return NextResponse.json({ message: "Order did'nt created" }, { status: 400 })
        }
    } catch (error) {
        console.error("Order save error:", error);
        return NextResponse.json({ error: "Server error while saving order" }, { status: 500 });
    }
};
