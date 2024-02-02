"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const variant_controller_1 = require("../controllers/variant.controller");
const router = (0, express_1.Router)();
router.route("/createNewVariant").post(variant_controller_1.createNewProductVariant);
router.route("/getProductVariant/:id").get(variant_controller_1.getVariantById);
router.route("./updateVariant/:id").patch(variant_controller_1.updateProductVariant);
exports.default = router;
