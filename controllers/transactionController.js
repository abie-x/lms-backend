import asyncHandler from 'express-async-handler'
import { Transaction } from '../models/transactionModel.js'

//desc => get the total transactions received today
//route => /api/transactions
//access => private(admin only)

const getTotalRevenue = async (req, res) => {
    try {
        const totalRevenue = await Transaction.aggregate([
            {
                $match: { type: 'credit' } // Filter transactions with type 'credit'
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' } // Calculate the total sum of 'amount' field
                }
            }
        ]);

        // If there are no transactions, return 0 as total revenue
        const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

        res.status(200).json({ totalRevenue: revenue });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching total revenue', error: error.message });
    }
};

const getRecentTransactions = asyncHandler(async (req, res) => {
  try {
      const recentTransactions = await Transaction.find({})
          .sort({ createdAt: -1 })
          .limit(25);

      res.status(200).json(recentTransactions);
  } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
  }
});


export { getTotalRevenue, getRecentTransactions };
