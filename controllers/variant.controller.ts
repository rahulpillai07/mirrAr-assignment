import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Product } from "../models/products.model";
import { ApiResponse } from "../utils/ApiResponse";
import { z } from "zod";
import {
  ProductType,
  productZodSchema,
  variantZodSchema,
} from "../types/zodTypes";
import { Variant } from "../models/variantSchema";

export const createNewProductVariant = asyncHandler(
  async (req: Request, res: Response) => {
    const newVariantDetail = variantZodSchema.safeParse(req.body);
    if (!newVariantDetail.success) res.status(404).json(newVariantDetail.error);
    else {
      const { name, additionalCost, SKU, stockCount, productID } =newVariantDetail.data;
      const baseProduct = await Product.findById(productID);
      if (!baseProduct) res.status(404).json("product not found");
      const newVariant = new Variant({
        name,
        SKU,
        additionalCost,
        stockCount,
        productID,
      });
      await newVariant.save();
      console.log(newVariant);
      baseProduct.variants.push(newVariant);
      await baseProduct.save();
      res.status(200).json(new ApiResponse(200,newVariant,'variant created successfully'));
    }
  }
);

export const getVariantById=asyncHandler(async(req:Request,res:Response)=>{
    const variantID = req.params.id;
    const productVariant=await Variant.findById(variantID);
    if(!productVariant)res.status(404).json('variant not found');
    res.json(productVariant);

})

export const updateProductVariant=asyncHandler(async(req:Request,res:Response)=>{
    const toBeUpdatedVariantId=req.params.id;
    const ProductVariant=await Variant.findById(toBeUpdatedVariantId);
    const toBeUpdatedDetails=variantZodSchema.safeParse(req.body);
    if(toBeUpdatedDetails.success){
        const{name,SKU,additionalCost,stockCount}=toBeUpdatedDetails.data;
        const updateVariant=ProductVariant?.updateOne({
            name,
            SKU,
            additionalCost,
            stockCount,
            productID:ProductVariant.productID
        },{new:true});
        res.status(200).json(new ApiResponse(200,updateVariant,"variant updated successfully"));
    }
    else res.status(404).json(toBeUpdatedDetails.error);
   
})