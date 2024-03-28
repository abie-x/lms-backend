import asyncHandler from 'express-async-handler';
import Expense from '../models/expenseModel.js';
import { Transaction } from '../models/transactionModel.js';
import { NiosStudent } from '../models/studentModel.js';

const getAdmissionsData = async (startDate, endDate) => {
  // Fetch admissions data based on the provided date range
  const admissions = await NiosStudent.find({
    createdAt: { $gte: startDate, $lte: endDate },
  })
    .select('_id name course admissionNumber')
    .exec();

  return admissions;
};

const getTransactionData = async (category, startDate, endDate) => {
  // Define query based on the category
  let query;
  console.log(startDate);
  console.log(endDate);
  switch (category) {
    case 'revenue':
      query = { type: 'credit', date: { $gte: startDate, $lte: endDate } };
      break;
    case 'expense':
      query = { type: 'debit', date: { $gte: startDate, $lte: endDate } };
      break;
  }

  // Fetch transaction data based on the provided query and date range
  const transactions = await Transaction.find(query).exec();
  return transactions;
};

const getDataByCategoryAndDuration = asyncHandler(async (req, res) => {
  try {
    // Get category and duration from request query parameters
    const { category, duration } = req.query;

    // Get current date
    const currentDate = new Date();
    let startDate = new Date(currentDate);
    let endDate = new Date(currentDate);

    // Determine start and end dates based on duration
    switch (duration) {
      case 'today':
        // Set start date to beginning of the day
        startDate.setHours(0, 0, 0, 0);
        // Set end date to end of the day
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'this_week':
        // Set start date to beginning of the current week (Sunday)
        startDate.setDate(startDate.getDate() - startDate.getDay());
        // Set end date to end of the current week (Saturday)
        endDate.setDate(endDate.getDate() - endDate.getDay() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'this_month':
        // Set start date to beginning of the current month
        startDate.setDate(1);
        // Set end date to end of the current month
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'custom':
        // If custom duration is provided, use the start_date and end_date query parameters
        startDate = new Date(req.query.start_date);
        endDate = new Date(req.query.start_date);

        // Set startDateTime to 12:00 AM
        startDate.setHours(0, 0, 0, 0);

        // Set endDateTime to 11:59 PM
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        return res.status(400).json({ message: 'Invalid duration parameter' });
    }

    let data;
    switch (category) {
      case 'admission':
        // Fetch admissions data
        data = await getAdmissionsData(startDate, endDate);
        break;
      case 'revenue':
        data = await getTransactionData(category, startDate, endDate);
        break;
      case 'expense':
        // Fetch transaction data for revenue or expense
        data = await getTransactionData(category, startDate, endDate);
        break;
      default:
        return res.status(400).json({ message: 'Invalid category parameter' });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export { getDataByCategoryAndDuration };
