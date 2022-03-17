import { Router } from "express";
const router = Router()
import skinsHandler from '../handlers/skins'
import {checkENT,checkAuth,checkSub} from '../middlewares/checkHeader'

router.post("/",[checkENT,checkAuth,checkSub],skinsHandler)
export default router