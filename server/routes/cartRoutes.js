import express from "express"
import protect from "../middleware/authMiddleware.js"
import cartController from "../controllers/cart/cartController.js"

const router = express.Router()

router.get("/", protect.forUser, cartController.getCart)
router.post("/", protect.forUser, cartController.addToCart)
router.put("/:productId", protect.forUser, cartController.updateQuantity)
router.delete("/:productId", protect.forUser, cartController.removeItem)
router.delete("/", protect.forUser, cartController.clearCart)

export default router
