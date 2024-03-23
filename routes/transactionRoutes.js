import express from 'express'
import { getTotalRevenue, getRecentTransactions } from '../controllers/transactionController.js'
import { protect, admin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/totalRevenue',  getTotalRevenue)
router.get('/recentTransactions', getRecentTransactions)

export default router