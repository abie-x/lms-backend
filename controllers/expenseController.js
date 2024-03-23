import asyncHandler from 'express-async-handler';
import Expense from '../models/expenseModel.js';
import { Transaction } from '../models/transactionModel.js';

// @desc    Add a new expense
// @route   POST /api/expense/add
// @access  Private
const addExpense = asyncHandler(async (req, res) => {
    const { category, amount, description, date } = req.body;

    const expense = await Expense.create({
        category,
        amount,
        description,
        date
    });

    // Create a transaction for the expense
    const transaction = await Transaction.create({
        amount: -amount, // Debit transaction, so amount is negative
        type: 'debit', // Debit transaction type
        description: `Expense:${description ? description : ''}`, // Description includes "Expense:" prefix
        date,
        // No studentId associated with an expense
    });

    res.status(201).send({ transaction });
});

const getTotalExpenses = asyncHandler(async (req, res) => {
    try {
        const totalExpenses = await Transaction.aggregate([
            {
                $match: { type: 'debit' }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        // Extract total expenses from the aggregation result
        const total = totalExpenses.length > 0 ? totalExpenses[0].total : 0;

        res.status(200).send({ totalExpenses: total });
    } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
    }
});


export { addExpense, getTotalExpenses };
