import express from 'express'
import { getTotalRevenue, getRecentTransactions, getTransactionsInfo, addRevenue } from '../controllers/transactionController.js'
import { protect, admin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/totalRevenue',  getTotalRevenue)
router.get('/recentTransactions', getRecentTransactions)
router.get('/info', getTransactionsInfo)
router.post('/addRevenue', addRevenue)

export default router