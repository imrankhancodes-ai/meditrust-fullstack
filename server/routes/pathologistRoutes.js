import express from "express"
import protect from "../middleware/authMiddleware.js"
import pathologistController from "../controllers/pathologist/pathologistController.js"

const router = express.Router()


router.get("/", pathologistController.getAllPathologists)
router.get("/tests", pathologistController.getAllPathologyTests)
router.get("/my", protect.forUser, pathologistController.getMyAppointments)
router.get("/appointments", protect.forUser, pathologistController.getAllAppointments)
router.get("/appointments/:aid", protect.forUser, pathologistController.getAppointment)

router.post("/request", protect.forUser, pathologistController.becomePathologist)
router.post("/add", protect.forUser, pathologistController.addPathologyTest)
router.post("/:pid", protect.forUser, pathologistController.bookTest)

router.put("/appointments/:aid", protect.forUser, pathologistController.updateAppointment)
router.put("/test/:tid", protect.forUser, pathologistController.updatePathologyTest)
router.delete("/test/:tid", protect.forUser, pathologistController.deletePathologyTest)


export default router