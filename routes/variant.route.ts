import{Router} from "express"
import { createNewProductVariant, getVariantById, updateProductVariant } from "../controllers/variant.controller";

const router=Router();
router.route("/createNewVariant").post(createNewProductVariant);
router.route("/getProductVariant/:id").get(getVariantById);
router.route("./updateVariant/:id").patch(updateProductVariant);
export default router;