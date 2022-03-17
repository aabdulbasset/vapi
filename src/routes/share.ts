import { Router } from "express";
import { createCollection,viewCollection } from "../handlers/share";
import { checkSub,checkSKins } from "../middlewares/checkHeader";
const router = Router()
router.post("/create",[checkSub,checkSKins],createCollection)
router.get("/view/:id",viewCollection)

export default router