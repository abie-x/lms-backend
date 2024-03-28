import asyncHandler from 'express-async-handler'
import { Transaction } from '../models/transactionModel.js'
import { NiosStudent } from '../models/studentModel.js';

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

        res.status(200).send({ totalRevenue: revenue });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching total revenue', error: error.message });
    }
};

const getRecentTransactions = asyncHandler(async (req, res) => {
  try {
      const recentTransactions = await Transaction.find({})
          .sort({ createdAt: -1 })
          .limit(25);

      res.status(200).send(recentTransactions);
  } catch (error) {
      res.status(500).send({ message: 'Internal server error' });
  }
});

const getPositiveTotalAmount = (transactions) => {
    let totalAmount = 0;
    transactions.forEach(transaction => {
        // Convert negative amounts to positive
        const amountToAdd = transaction.amount < 0 ? -transaction.amount : transaction.amount;
        totalAmount += amountToAdd;
    });
    return totalAmount;
}

const getAdmissionsCount = async (startDate, endDate) => {
    const admissions = await NiosStudent.find({ createdAt: { $gte: startDate, $lte: endDate } }).exec();
    return admissions.length;
};

const getCategoryData = async (category, startDate, endDate) => {
    let query;
    switch (category) {
        case 'revenue':
            
            query = { type: 'credit', date: { $gte: startDate, $lte: endDate } };
            break;
        case 'expense':
            query = { type: 'debit', date: { $gte: startDate, $lte: endDate } };
            break;
        case 'admissions':
            return getAdmissionsCount(startDate, endDate);
    }

    const transactions = await Transaction.find(query).exec();
    const totalAmount = getPositiveTotalAmount(transactions);
    return totalAmount;
};

const getTransactionsInfo = asyncHandler(async (req, res) => {
    try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();
        
        // Create a new Date object with the same year, month, and day, but set the time to 12:00 AM
        let startDate = new Date(currentYear, currentMonth, currentDay, 0, 0, 0, 0);
        
        // Set endDate to 11:59:59 PM
        let endDate = new Date(currentYear, currentMonth, currentDay, 23, 59, 59, 999);

        console.log(startDate)
        console.log(endDate)

        const categories = ['admission', 'revenue', 'expense'];
        const data = {};

        for (const category of categories) {
            let dailyData, weeklyData, monthlyData;
            if (category === 'admission') {
                dailyData = await getAdmissionsCount(startDate, endDate);
            } else {
                dailyData = await getCategoryData(category, startDate, endDate);
                console.log(`${category} : ${dailyData}`)
            }

            // Get weekly data
            startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of the week (Sunday)
            endDate.setDate(endDate.getDate() - endDate.getDay() + 6); // End of the week (Saturday)
            endDate.setHours(23, 59, 59, 999);

            if (category === 'admission') {
                weeklyData = await getAdmissionsCount(startDate, endDate);
            } else {
                weeklyData = await getCategoryData(category, startDate, endDate);
               
            }

            // Get monthly data
            startDate.setDate(1); // Start of the month
            endDate.setMonth(endDate.getMonth() + 1); // Start of next month
            endDate.setDate(0); // Last day of the current month

            if (category === 'admission') {
                monthlyData = await getAdmissionsCount(startDate, endDate);
            } else {
                monthlyData = await getCategoryData(category, startDate, endDate);
               
            }

            data[category] = { dailyData, weeklyData, monthlyData };
        }

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// const getCategoryData = async (category, startDate, endDate) => {
//     let query;
//     switch (category) {
//         case 'revenue':
//             query = { type: 'credit', date: { $gte: startDate, $lte: endDate } };
//             break;
//         case 'expense':
//             query = { type: 'debit', date: { $gte: startDate, $lte: endDate } };
//             break;
//     }

//     const transactions = await Transaction.find(query).exec();
//     const totalAmount = getPositiveTotalAmount(transactions);
//     return totalAmount;
// }

// const getTransactionsInfo = asyncHandler(async (req, res) => {
//     try {
//         const category = req.query.category;

//         if (!category || !['revenue', 'expense'].includes(category)) {
//             return res.status(400).json({ message: 'Invalid category parameter' });
//         }

//         const currentDate = new Date();
//         const startDate = new Date(currentDate);
//         const endDate = new Date(currentDate);
        
//         // Get daily data
//         startDate.setHours(0, 0, 0, 0);
//         endDate.setHours(23, 59, 59, 999);
//         const dailyData = await getCategoryData(category, startDate, endDate);

//         // Get weekly data
//         startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of the week (Sunday)
//         endDate.setDate(endDate.getDate() - endDate.getDay() + 6); // End of the week (Saturday)
//         endDate.setHours(23, 59, 59, 999);
//         const weeklyData = await getCategoryData(category, startDate, endDate);

//         // Get monthly data
//         startDate.setDate(1); // Start of the month
//         endDate.setMonth(endDate.getMonth() + 1); // Start of next month
//         endDate.setDate(0); // Last day of the current month
//         const monthlyData = await getCategoryData(category, startDate, endDate);

//         res.json({ dailyData, weeklyData, monthlyData });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// })


export { getTotalRevenue, getRecentTransactions, getTransactionsInfo };
