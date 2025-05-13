import { BillSummaryProps } from "@/types/Bill_and_Cart_Types";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import UpdateProfile from "../modalsandpopups/UpdateProfile";

const BillSummary: React.FC<BillSummaryProps> = ({ cart }) => {
    const [coupon, setCoupon] = useState("");
    const [couponStatus, setCouponStatus] = useState<"valid" | "invalid" | null>(null);
    const [appliedCoupon, setAppliedCoupon] = useState<null | { code: string; discountPercent: number }>(null);
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [user, setUser] = useState({
        username: "",
        email: "",
        phone: "",
        address: "",
    });

    const validCoupons: Record<string, number> = {
        SAVE10: 10,
        FREESHIP: 5,
    };

    const handleCheckCoupon = () => {
        const upper = coupon.trim().toUpperCase();
        if (validCoupons[upper]) {
            setCouponStatus("valid");
            setAppliedCoupon({ code: upper, discountPercent: validCoupons[upper] });
        } else {
            setCouponStatus("invalid");
            setAppliedCoupon(null);
        }
    };

    const handlePayment = async () => {
        try {
            const paymentResponse = await axios.post('/api/payment', {}, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            const order = paymentResponse.data.order_details;
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
                amount: order.amount,
                currency: "INR",
                name: "Trade nest",
                description: "Order Payment",
                image: "/assets/trade_nest.png",
                order_id: order.id,
                handler: async function (response: any) {
                    toast.success("Payment successful!");
                    await axios.post("/api/payment/verifypayment", {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        cart,
                        totalAmount,
                        appliedCoupon
                    });
                },
                prefill: {
                    name: user.username,
                    email: user.email,
                    contact: String(user.phone),
                },
                notes:{ 
                    "address": "Trade Nest"
                },
                theme: {
                    color: "#3399cc",
                },
            };
    
            const rzp = new window.Razorpay(options);
            rzp.open();
            toast.dismiss();
    
        } catch (error: any) {
            console.log("Payment error:", error);
    
            if (error.response?.status === 401 && error.response.data.message === "Please setup your address before Checkout") {
                toast.error("Please setup your delivery address.");
                setUser(error.response.data.user);
                setOpenProfileModal(true);
                return;
            }

            if (error.response?.status === 401 && error.response.data.message === "Please setup your phone before Checkout") { 
                toast.error("Please setup your phone before Checkout")
                setUser(error.response.data.user);
                setOpenProfileModal(true)
                return;
            }
    
            toast.error("Oops! Some error occurred while handling payment.");
        }
    };
    

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity_buyed, 0);
    const discountAmount = appliedCoupon ? subtotal * (appliedCoupon.discountPercent / 100) : 0;
    const gstPercent = 18;
    const gstAmount = (subtotal - discountAmount) * (gstPercent / 100);
    const totalAmount = subtotal - discountAmount + gstAmount;
    const totalItems = cart.reduce((acc, item) => acc + item.quantity_buyed, 0);

    return (
        <>
            <div className="bg-gray-50 rounded-xl shadow-md p-6 w-full md:w-1/3 sticky top-20">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Bill Summary</h2>
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span>Total Items</span>
                        <span>{totalItems}</span>
                    </div>
                    <div className="flex justify-between font-medium text-md">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                    </div>

                    {appliedCoupon && (
                        <div className="flex justify-between text-green-600 font-medium text-md">
                            <span>Coupon ({appliedCoupon.code})</span>
                            <span>-₹{discountAmount.toLocaleString()}</span>
                        </div>
                    )}

                    <div className="flex justify-between font-medium text-md">
                        <span>GST ({gstPercent}%)</span>
                        <span>₹{gstAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between font-bold text-lg">
                        <span>Total Amount</span>
                        <span>₹{totalAmount.toLocaleString()}</span>
                    </div>

                    {!appliedCoupon && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-1">Gift Coupon</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    value={coupon}
                                    onChange={(e) => {
                                        setCoupon(e.target.value);
                                        setCouponStatus(null);
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <button
                                    onClick={handleCheckCoupon}
                                    className={`bg-blue-200 text-blue-500 px-4 py-2 rounded-full cursor-pointer ${!coupon ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={!coupon.trim()}
                                >
                                    Check
                                </button>
                            </div>
                            {couponStatus && (
                                <p className={`mt-2 text-sm ${couponStatus === "valid" ? "text-green-600" : "text-red-500"}`}>
                                    {couponStatus === "valid"
                                        ? "Coupon applied successfully!"
                                        : "Invalid coupon code."}
                                </p>
                            )}
                        </div>
                    )}

                    <button
                        className="mt-6 w-full bg-blue-200 text-blue-500 py-3 rounded-full cursor-pointer"
                        onClick={handlePayment}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>

            {/* Only show modal if explicitly opened */}
            {openProfileModal && (
                <UpdateProfile
                    profile={{
                        username: user.username,
                        email: user.email,
                        address: user.address,
                        phone: user.phone,
                    }}
                    onClose={() => setOpenProfileModal(false)}
                />
            )}
        </>
    );
};

export default BillSummary;
