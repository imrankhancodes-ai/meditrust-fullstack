import express from "express"
import protect from "../middleware/authMiddleware.js"
import aiController from "../controllers/ai/aiController.js"
import creditController from "../controllers/credit/creditController.js"
import upload from "../middleware/fileUploadMiddleware.js"

const router = express.Router()

router.get("/credits", protect.forUser, creditController.getBalance)
router.post("/credits/request", protect.forUser, creditController.requestCredits)
router.get("/credits/requests", protect.forUser, creditController.myRequests)

router.post("/prescription", protect.forUser, upload.single('prescription'), aiController.explainPrescription)
router.get("/prescriptions", protect.forUser, aiController.getMyPrescriptions)
router.get("/prescriptions/:pid", protect.forUser, aiController.getPrescriptionById)
router.get("/find/:pid", protect.forUser, aiController.findMedicines)

export default router