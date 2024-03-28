import express from 'express'
import { getTotalRevenue, getRecentTransactions, getTransactionsInfo } from '../controllers/transactionController.js'
import { protect, admin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/totalRevenue',  getTotalRevenue)
router.get('/recentTransactions', getRecentTransactions)
router.get('/info', getTransactionsInfo)

export default router