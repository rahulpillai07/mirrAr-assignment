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

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await Product.find({}).populate("variants");

    if (products.length === 0) {
      throw new Error("No products found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, products, "Fetched all products successfully")
      );
  }
);

export const getProductByProductId = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params.id;
    console.log(`this is the product ID ${productId}`);
    const fetchProductById = await Product.findById(productId).populate(
      "variants"
    );
    if (!fetchProductById) res.status(404).json("no product found");
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          fetchProductById,
          "product fetched successfully by its productID"
        )
      );
  }
);

export const createNewProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const productZodDetail = productZodSchema.safeParse(req.body);
    if (productZodDetail.success) {
      const { name, description, price, variants } = productZodDetail.data;
      const newProduct = new Product({
        name,
        description,
        price,
        variants: [],
      });
      await newProduct.save();
      const productId = newProduct._id;

      for (const variant of variants!) {
        const newVariant = new Variant({
          ...variant,
          productID: productId, // Associate the variant with the product
        });
        await newVariant.save();
        newProduct.variants.push(newVariant._id);
      }

      await newProduct.save();
      res
        .status(201)
        .json(new ApiResponse(200, newProduct, "product created successfully"));
    } else {
      res.json(productZodDetail.error);
    }
  }
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params.id;
    const productZodDetail = productZodSchema.safeParse(req.body);
    if (productZodDetail.success) {
      const { name, description, price } = productZodDetail.data;

      const toBeUpdatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          name,
          description,
          price,
        },
        { new: true }
      );
      res
        .status(201)
        .json(
          new ApiResponse(
            200,
            toBeUpdatedProduct,
            "product updated successfully"
          )
        );
      if (!toBeUpdatedProduct) {
        res.status(404).json("No Product Found");
      }
    }
  }
);

export const deleteProduct=asyncHandler(async(req:Request,res:Response)=>{
    const productId=req.params.id;
    const productToBeDeleted=await Product.findByIdAndDelete(productId);
    if(!productToBeDeleted)res.status(404).json( new Error('product not found'));
    res.status(200).json(new ApiResponse(201,productToBeDeleted,"product deleted successfully"));
})
interface searchResponse{
    products:any[],
    variants?:any[]
}
export const search=asyncHandler(async(req:Request,res:Response)=>{
    const searchQuery:string=req.query.product as string;
    console.log(searchQuery);
    
    const productResults = await Product.find({
        $or: [
            { name: { $regex: searchQuery, $options: 'i' } }, 
            { description: { $regex: searchQuery, $options: 'i' } } // 
        ]
    });

   
    const variantResults = await Variant.find({
        name: { $regex: searchQuery, $options: 'i' } 
    });


    const response= {
        products: productResults.length > 0 ? productResults : null,
        variants: variantResults.length > 0 ? variantResults : null
    };
    console.log(response);
    if (!response.products && !response.variants) {
        res.status(404).json(new ApiResponse(404,response,'products not found'));
    } else {
        res.status(200).json(new ApiResponse(200, response, 'Products found successfully'));
    }
})
