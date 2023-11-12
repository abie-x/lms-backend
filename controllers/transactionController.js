import asyncHandler from 'express-async-handler'
import { Transaction } from '../models/transactionModel.js'

//desc => get the total transactions received today
//route => /api/transactions
//access => private(admin only)

const getTransactionValue = asyncHandler(async (req, res) => {
    // Get the current date and time
    const currentDate = new Date();

    // Calculate the start of the day (midnight)
    currentDate.setHours(0, 0, 0, 0);

    // Calculate the end of the day (11:59:59 PM)
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find transactions that occurred today
    const transactionsToday = await Transaction.find({
        createdAt: {
          $gte: currentDate,
          $lt: endOfDay,
        },
      });
  
      // Calculate the total rupees received today
      const totalRupeesReceivedToday = transactionsToday.reduce(
        (total, transaction) => total + transaction.amount,
        0
      );
  
      res.status(200).json({
        totalRupeesReceivedToday,
      });
})

export {
    getTransactionValue
}