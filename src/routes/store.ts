import { Router } from "express";
const router = Router()
import storeHandler from '../handlers/store'
import {checkENT,checkAuth,checkSub} from '../middlewares/checkHeader'


router.post("/",[checkENT,checkAuth,checkSub],storeHandler)
export default router