import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: false },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false }, 
  subtotal: Number,
  coupon: {
    code: String,
    discountPercent: Number,
    discountAmount: Number,
  },
  gstPercent: Number,
  gstAmount: Number,
  totalAmount: Number,
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
}, { timestamps: true });

billSchema.index(
  { user: 1, cart: 1 },
  {
    unique: true,
    partialFilterExpression: {
      cart: { $type: "objectId" },
    },
  }
);



const Bill = mongoose.models.Bill || mongoose.model("Bill", billSchema);

export default Bill;
