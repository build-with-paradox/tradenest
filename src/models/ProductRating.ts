import mongoose from "mongoose";

const productRatingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
      index: true, 
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", 
      required: true,
      index: true, 
    },
    rating: {
      type: Number,
      required: true,
      min: 1, 
      max: 5, 
    },
    review: {
      type: String,
      trim: true,
      maxlength: 1000, 
    },
  },
  {
    timestamps: true, 
  }
);

productRatingSchema.index({ user: 1, product: 1 }, { unique: true });

const ProductRating =  mongoose.models.ProductRating || mongoose.model("ProductRating", productRatingSchema);

export default ProductRating;
