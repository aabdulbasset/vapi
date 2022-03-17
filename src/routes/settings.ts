import {settingsGetter, settingsSetter} from '../handlers/settings'
import {Router} from 'express'
import { checkAuth,checkColor } from '../middlewares/checkHeader'

const router = Router()
router.get('/',checkAuth,settingsGetter)
router.post('/',[checkAuth,checkColor],settingsSetter)

export default router