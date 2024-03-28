import asyncHandler from 'express-async-handler';
import Expense from '../models/expenseModel.js';
import { Transaction } from '../models/transactionModel.js';
import { NiosStudent } from '../models/studentModel.js';

// @desc    Add a new expense
// @route   POST /api/expense/add
// @access  Private
const addExpense = asyncHandler(async (req, res) => {
  const { category, amount, description, date } = req.body;

  console.log(category)
  console.log(amount)
  console.log(description)
  console.log(date)

  try {
    const expense = await Expense.create({
      category,
      amount,
      description,
      date,
    });

    // Create a transaction for the expense
    const transaction = await Transaction.create({
      amount: -amount, // Debit transaction, so amount is negative
      type: 'debit', // Debit transaction type
      purpose: category,
      description: `Expense:${description ? description : ''}`, // Description includes "Expense:" prefix
      date,
      // No studentId associated with an expense
    });

    res.status(201).send({ transaction });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

const getTotalExpenses = asyncHandler(async (req, res) => {
  try {
    const totalExpenses = await Transaction.aggregate([
      {
        $match: { type: 'debit' },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Extract total expenses from the aggregation result
    const total = totalExpenses.length > 0 ? totalExpenses[0].total : 0;

    res.status(200).send({ totalExpenses: total });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
});

const getExpenseOnDuration = asyncHandler(async (req, res) => {
    try {
      // Get the duration parameter from query
      const duration = req.query.duration;
  
      // Validate the duration parameter
      let startDate, endDate;
      switch (duration) {
        case 'today':
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          // Set endDate to end of day
          endDate.setHours(23, 59, 59, 999);
          break;
  
        case 'this_week':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - startDate.getDay());
          endDate = new Date();
          endDate.setDate(endDate.getDate() - endDate.getDay() + 6);
          break;
        case 'this_month':
          startDate = new Date();
          startDate.setDate(1);
          endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 1);
          endDate.setDate(0);
          break;
        case 'custom':
          // Get custom start and end dates from query params
          startDate = new Date(req.query.start_date);
          endDate = new Date(req.query.end_date);
          break;
        default:
          return res.status(400).json({ message: 'Invalid duration parameter' });
      }
  
      // Fetch expenses based on duration
      const expenses = await Expense.find({
        date: { $gte: startDate, $lte: endDate },
      });
  
      // Calculate the sum of all amounts
      const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
  
      // Send the response with fetched expenses and total amount
      res.json({ expenses, totalAmount });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  

  

export { addExpense, getTotalExpenses, getExpenseOnDuration };
