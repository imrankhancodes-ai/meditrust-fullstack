import express from "express"
import adminService from "../controllers/admin/adminController.js"
import creditController from "../controllers/credit/creditController.js"
import protect from "../middleware/authMiddleware.js"
import upload from "../middleware/fileUploadMiddleware.js"

const router = express.Router()

router.get("/users", protect.forAdmin, adminService.getAllUsers)
router.get("/products", protect.forAdmin, adminService.getAllProducts)
router.get("/pathologists", protect.forAdmin, adminService.getAllPathologists)
router.get("/doctors", protect.forAdmin, adminService.getAllDoctors)
router.get("/orders", protect.forAdmin, adminService.getAllOrders)
router.put("/orders/:oid", protect.forAdmin, adminService.updateOrderStatus)

router.post("/product", protect.forAdmin, upload.single('image'), adminService.addProduct)

router.put("/product/:pid", protect.forAdmin, adminService.updateProduct)
router.delete("/product/:pid", protect.forAdmin, adminService.deleteProduct)
router.put("/pathologists/:pid", protect.forAdmin, adminService.updatePathologist)
router.put("/doctor/:did", protect.forAdmin, adminService.updateDoctor)

router.get("/credit-requests", protect.forAdmin, creditController.getAllRequests)
router.put("/credit-requests/:rid", protect.forAdmin, creditController.reviewRequest)
router.put("/users/:uid/credits", protect.forAdmin, creditController.grantCreditsDirect)


export default router