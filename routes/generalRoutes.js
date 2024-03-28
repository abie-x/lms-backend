import express from 'express'
import { getDataByCategoryAndDuration } from '../controllers/generalController.js'

const router = express.Router()

router.get('/insights', getDataByCategoryAndDuration)

export default router