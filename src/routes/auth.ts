import express from 'express'
import {authHandler,reauth} from '../handlers/auth'
import checkUserPass from '../middlewares/checkCredentials'

const router = express.Router()
router.post('/',checkUserPass,authHandler)
router.post('/reauth',reauth)
export default router