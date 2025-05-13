// /models/Users.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "seller", "buyer"],
      required: true,
      default: "buyer",
    },
    password: {
      type: String,
      select: false,
    },
    verification_code: {
      type: Number,
    },
    verification_code_expires: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: Number,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      default: "credentials",
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1, provider: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
