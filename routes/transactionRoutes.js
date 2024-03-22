import express from 'express'
import { getTotalRevenue } from '../controllers/transactionController.js'
import { protect, admin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/totalRevenue',  getTotalRevenue)

export default router