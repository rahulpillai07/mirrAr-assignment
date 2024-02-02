"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productZodSchema = exports.variantZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
// Define the Variant schema with reference to the Product schema
exports.variantZodSchema = zod_1.default.object({
    name: zod_1.default.string(),
    SKU: zod_1.default.string(),
    additionalCost: zod_1.default.number(),
    stockCount: zod_1.default.number(),
    productID: zod_1.default.custom(),
});
exports.productZodSchema = zod_1.default.object({
    name: zod_1.default.string().min(3).max(15),
    description: zod_1.default.string().min(3).max(50),
    price: zod_1.default.number(),
    variants: zod_1.default.array(exports.variantZodSchema).optional()
});
