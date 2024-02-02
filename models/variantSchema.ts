import mongoose,{Schema} from "mongoose";
import {VariantType} from "../types/zodTypes"

const variantSchema=new Schema<VariantType>({
    name:{
        type:String,
        required:[true,'name is required']
    },
    SKU:{
        type:String,
        required:[true,'SKU is required']
    },
    additionalCost:{
        type:Number,
        required:[true,'price is required']
    },
    stockCount:{
        type:Number,
        required:[true,'stockCount is required']
    },
    productID:{
        type:Schema.Types.ObjectId,
        ref:'Product'
    }
});

export const Variant= mongoose.model('variants',variantSchema)