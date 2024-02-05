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
exports.search = exports.deleteProduct = exports.updateProduct = exports.createNewProduct = exports.getProductByProductId = exports.getAllProducts = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const products_model_1 = require("../models/products.model");
const ApiResponse_1 = require("../utils/ApiResponse");
const zodTypes_1 = require("../types/zodTypes");
const variantSchema_1 = require("../models/variantSchema");
exports.getAllProducts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield products_model_1.Product.find({}).populate("variants");
    if (products.length === 0) {
        throw new Error("No products found");
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, products, "Fetched all products successfully"));
}));
exports.getProductByProductId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    console.log(`this is the product ID ${productId}`);
    const fetchProductById = yield products_model_1.Product.findById(productId).populate("variants");
    if (!fetchProductById)
        res.status(404).json("no product found");
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, fetchProductById, "product fetched successfully by its productID"));
}));
exports.createNewProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productZodDetail = zodTypes_1.productZodSchema.safeParse(req.body);
    if (productZodDetail.success) {
        const { name, description, price, variants } = productZodDetail.data;
        const newProduct = new products_model_1.Product({
            name,
            description,
            price,
            variants: [],
        });
        yield newProduct.save();
        const productId = newProduct._id;
        for (const variant of variants) {
            const newVariant = new variantSchema_1.Variant(Object.assign(Object.assign({}, variant), { productID: productId }));
            yield newVariant.save();
            newProduct.variants.push(newVariant._id);
        }
        yield newProduct.save();
        res
            .status(201)
            .json(new ApiResponse_1.ApiResponse(200, newProduct, "product created successfully"));
    }
    else {
        res.json(productZodDetail.error);
    }
}));
exports.updateProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const productZodDetail = zodTypes_1.productZodSchema.safeParse(req.body);
    if (productZodDetail.success) {
        const { name, description, price } = productZodDetail.data;
        const toBeUpdatedProduct = yield products_model_1.Product.findByIdAndUpdate(productId, {
            name,
            description,
            price,
        }, { new: true });
        res
            .status(201)
            .json(new ApiResponse_1.ApiResponse(200, toBeUpdatedProduct, "product updated successfully"));
        if (!toBeUpdatedProduct) {
            res.status(404).json("No Product Found");
        }
    }
}));
exports.deleteProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const productToBeDeleted = yield products_model_1.Product.findByIdAndDelete(productId);
    if (!productToBeDeleted)
        res.status(404).json(new Error('product not found'));
    res.status(200).json(new ApiResponse_1.ApiResponse(201, productToBeDeleted, "product deleted successfully"));
}));
exports.search = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchQuery = req.query.product;
    console.log(searchQuery);
    const productResults = yield products_model_1.Product.find({
        $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } } // 
        ]
    });
    const variantResults = yield variantSchema_1.Variant.find({
        name: { $regex: searchQuery, $options: 'i' }
    });
    const response = {
        products: productResults.length > 0 ? productResults : null,
        variants: variantResults.length > 0 ? variantResults : null
    };
    console.log(response);
    if (!response.products && !response.variants) {
        res.status(404).json(new ApiResponse_1.ApiResponse(404, response, 'products not found'));
    }
    else {
        res.status(200).json(new ApiResponse_1.ApiResponse(200, response, 'Products found successfully'));
    }
}));
