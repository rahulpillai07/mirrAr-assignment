import mongoose,{ObjectId, isValidObjectId} from 'mongoose';
import z from 'zod'


// Define the Variant schema with reference to the Product schema
export const variantZodSchema = z.object({
    name: z.string(),
    SKU: z.string(),
    additionalCost: z.number(),
    stockCount: z.number(),
    productID:z.custom<mongoose.Types.ObjectId>(),
});

export const productZodSchema = z.object({
    name: z.string().min(3).max(15),
    description: z.string().min(3).max(50),
    price: z.number(),
    variants:z.array(variantZodSchema).optional()

});




export type ProductType=z.infer<typeof productZodSchema>
export type VariantType=z.infer<typeof variantZodSchema>