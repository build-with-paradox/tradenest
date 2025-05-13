import { mongooseConnection } from "@/lib/mongooseconnection";
import Cart from "@/models/Cart";
import Bill from "@/models/Bill";
import Coupon from "@/models/Coupon";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  await mongooseConnection();

  const token = await getToken({ req });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = token.id;
  const { searchParams } = new URL(req.url);
  const couponCode = searchParams.get("couponCode");

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.products.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 404 });
    }

    const subtotal = cart.products.reduce((acc: number, item: any) => {
      return acc + item.price * item.quantity_buyed;
    }, 0);

    let coupon = null;
    let discountAmount = 0;

    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode });

      if (!coupon) {
        return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
      }

      const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
      if (isExpired) {
        return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
      }

      discountAmount = (subtotal * coupon.discountPercent) / 100;
    }

    const gstPercent = 18;
    const gstAmount = (subtotal * gstPercent) / 100;
    const totalAmount = subtotal + gstAmount - discountAmount;

    // Check if a bill already exists for this cart
    let bill = await Bill.findOne({ user: userId, cart: cart._id });

    if (bill) {
      bill.subtotal = subtotal;
      bill.coupon = coupon
        ? {
            code: coupon.code,
            discountPercent: coupon.discountPercent,
            discountAmount: discountAmount,
          }
        : null;
      bill.gstPercent = gstPercent;
      bill.gstAmount = gstAmount;
      bill.totalAmount = totalAmount;
      bill.isPaid = false;
      bill.paidAt = null;

      await bill.save();
    } else {
      bill = await Bill.create({
        user: userId,
        cart: cart._id,
        subtotal,
        coupon: coupon
          ? {
              code: coupon.code,
              discountPercent: coupon.discountPercent,
              discountAmount: discountAmount,
            }
          : null,
        gstPercent,
        gstAmount,
        totalAmount,
        isPaid: false,
      });
    }

    return NextResponse.json({ success: true, bill: bill }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
