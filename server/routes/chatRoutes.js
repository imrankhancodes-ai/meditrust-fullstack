import express from "express"
import protect from "../middleware/authMiddleware.js"
import chatController from "../controllers/chat/chatController.js"

const router = express.Router()

router.get("/", protect.forUser, chatController.getHistory)
router.post("/", protect.forUser, chatController.sendMessage)

export default router
