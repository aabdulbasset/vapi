import { Router } from "express";
import { checkSub,checkENT,checkAuth } from "../middlewares/checkHeader";
import { inGame,gameStatus } from '../handlers/currentgame'
const router = Router()
router.post("/ingame", checkSub, checkAuth, checkENT, inGame);
router.post("/gamestatus", checkSub, checkAuth, checkENT, gameStatus);
export default router