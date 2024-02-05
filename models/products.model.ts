import mongoose, { Schema } from "mongoose";
import { ProductType } from "../types/zodTypes";
import { boolean, string } from "zod";
import { Variant } from "./variantSchema";

const productSchema = new Schema<ProductType>({
  name:{
    type:String,
    required:[true,"name is required"]
  } , 
  description: {
    type: String,
    required: [true, "description is required"],
  },
  price: {
    type: Number,
    required: [true, "price is required"],
  },
  variants: [
    {
      type: Schema.Types.ObjectId,
      ref: Variant.modelName,
    },
  ],
});
productSchema.index({ name: 'text', description: 'text' });

export const Product =
  mongoose.models.Product || mongoose.model("products", productSchema);
