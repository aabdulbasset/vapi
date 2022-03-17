import express from 'express'
import authHandler from '../handlers/auth'
import checkUserPass from '../middlewares/checkCredentials'

const router = express.Router()
router.post('/',checkUserPass,authHandler)

export default router