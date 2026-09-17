import express from "express"
import protect from "../middleware/authMiddleware.js"
import orderController from "../controllers/order/orderController.js"

const router = express.Router()

router.post("/", protect.forUser, orderController.placeOrder)
router.get("/", protect.forUser, orderController.getMyOrders)
router.get("/:oid", protect.forUser, orderController.getOrder)
router.put("/:oid/cancel", protect.forUser, orderController.cancelOrder)

export default router
