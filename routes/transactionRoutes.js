import express from 'express'
import { getTransactionValue } from '../controllers/transactionController.js'
import { protect, admin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', protect, admin, getTransactionValue)

export default router