import express from 'express'
import { addExpense, getTotalExpenses } from '../controllers/expenseController.js'

const router = express.Router()

router.post('/add', addExpense)
router.get('/totalExpense', getTotalExpenses)

export default router