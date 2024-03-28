import express from 'express'
import { addExpense, getTotalExpenses, getExpenseOnDuration } from '../controllers/expenseController.js'

const router = express.Router()

router.post('/add', addExpense)
router.get('/totalExpense', getTotalExpenses)
router.get('/', getExpenseOnDuration)

export default router