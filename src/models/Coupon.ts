import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: String,
  discountPercent: Number,
  expiresAt: Date,
}, { timestamps: true });

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

export default Coupon;
