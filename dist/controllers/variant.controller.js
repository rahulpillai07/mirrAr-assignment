"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductVariant = exports.getVariantById = exports.createNewProductVariant = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const products_model_1 = require("../models/products.model");
const ApiResponse_1 = require("../utils/ApiResponse");
const zodTypes_1 = require("../types/zodTypes");
const variantSchema_1 = require("../models/variantSchema");
exports.createNewProductVariant = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newVariantDetail = zodTypes_1.variantZodSchema.safeParse(req.body);
    if (!newVariantDetail.success)
        res.status(404).json(newVariantDetail.error);
    else {
        const { name, additionalCost, SKU, stockCount, productID } = newVariantDetail.data;
        const baseProduct = yield products_model_1.Product.findById(productID);
        if (!baseProduct)
            res.status(404).json("product not found");
        const newVariant = new variantSchema_1.Variant({
            name,
            SKU,
            additionalCost,
            stockCount,
            productID,
        });
        yield newVariant.save();
        console.log(newVariant);
        baseProduct.variants.push(newVariant);
        yield baseProduct.save();
        res.status(200).json(new ApiResponse_1.ApiResponse(200, newVariant, 'variant created successfully'));
    }
}));
exports.getVariantById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const variantID = req.params.id;
    const productVariant = yield variantSchema_1.Variant.findById(variantID);
    if (!productVariant)
        res.status(404).json('variant not found');
    res.json(productVariant);
}));
exports.updateProductVariant = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const toBeUpdatedVariantId = req.params.id;
    const ProductVariant = yield variantSchema_1.Variant.findById(toBeUpdatedVariantId);
    const toBeUpdatedDetails = zodTypes_1.variantZodSchema.safeParse(req.body);
    if (toBeUpdatedDetails.success) {
        const { name, SKU, additionalCost, stockCount } = toBeUpdatedDetails.data;
        const updateVariant = ProductVariant === null || ProductVariant === void 0 ? void 0 : ProductVariant.updateOne({
            name,
            SKU,
            additionalCost,
            stockCount,
            productID: ProductVariant.productID
        }, { new: true });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, updateVariant, "variant updated successfully"));
    }
    else
        res.status(404).json(toBeUpdatedDetails.error);
}));
