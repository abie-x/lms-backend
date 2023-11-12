import express from 'express'
import { registerNios, updateNios } from '../controllers/courseController.js'
import { protect, admin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/nios', protect, admin, registerNios)
router.put('/nios', updateNios)

export default router