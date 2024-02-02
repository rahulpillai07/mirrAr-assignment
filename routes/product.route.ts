import { Router } from "express";
import { createNewProduct, deleteProduct, getAllProducts, getProductByProductId, updateProduct } from "../controllers/product.controller";

const router=Router()
router.route("/createProduct").post(createNewProduct)
router.route("/getAllProducts").get(getAllProducts)
router.route("/getProductById/:id").get(getProductByProductId);
router.route("/updateProduct/:id").patch(updateProduct);
router.route("/deleteProduct/:id").delete(deleteProduct);

export default router;