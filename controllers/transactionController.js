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
    console.log(`category: ${category}`)
    switch (category) {
        case 'revenue':
            // For revenue, fetch transactions for the entire month
            query = { type: 'credit', date: { $gte: startDate, $lte: endDate } };
            console.log(query)
            break;
        case 'expense':
            // For expense, fetch transactions for the entire month
            query = { type: 'debit', date: { $gte: startDate, $lte: endDate } };
            break;
        
    }

    const transactions = await Transaction.find(query).exec();
    console.log(transactions.length)
    const totalAmount = getPositiveTotalAmount(transactions);
    return totalAmount;
};


const getTransactionsInfo = asyncHandler(async (req, res) => {
    try {
        const currentDate = new Date();
        let startDate = new Date(currentDate); // Create a new variable for startDate
        let endDate = new Date(currentDate);   // Create a new variable for endDate

        // Get daily data
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const categories = ['admission', 'revenue', 'expense'];
        const data = {};

        for (const category of categories) {
            let dailyData, weeklyData, monthlyData;

            // Get daily data
            if (category === 'admission') {
                dailyData = await getAdmissionsCount(startDate, endDate);
            } else {
                dailyData = await getCategoryData(category, startDate, endDate);
            }

            // Get weekly data
            const weekStartDate = new Date(currentDate); // Create a new variable for weekStartDate
            weekStartDate.setHours(0, 0, 0, 0)
            
            const weekEndDate = new Date(currentDate);     // Create a new variable for weekEndDate
            weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
            weekEndDate.setDate(weekEndDate.getDate() - weekEndDate.getDay() + 6);
            weekEndDate.setHours(23, 59, 59, 999);

            // console.log(`printing weekly datas`)
            // console.log(weekStartDate)
            // console.log(weekEndDate)

            if (category === 'admission') {
                weeklyData = await getAdmissionsCount(weekStartDate, weekEndDate);
            } else {
                weeklyData = await getCategoryData(category, weekStartDate, weekEndDate);
            }

            // Get monthly data
            const monthStartDate = new Date(startDate); // Create a new variable for monthStartDate
            const monthEndDate = new Date(endDate);     // Create a new variable for monthEndDate
            monthStartDate.setDate(1);
            monthEndDate.setMonth(monthEndDate.getMonth() + 1);
            monthEndDate.setDate(0);

            // console.log(`printing monthy dates`)
            // console.log(monthStartDate)
            // console.log(monthEndDate)

            if (category === 'admission') {
                monthlyData = await getAdmissionsCount(monthStartDate, monthEndDate);
            } else {
                monthlyData = await getCategoryData(category, monthStartDate, monthEndDate);
            }

            // Store data for the category
            data[category] = { dailyData, weeklyData, monthlyData };
        }

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const addRevenue = asyncHandler(async (req, res) => {
    const { category, amount, description, date } = req.body;
    console.log(category)
    console.log(amount)
    console.log(description)
    console.log(date)
  
    try {
    //   const expense = await Transaction.create({
    //     category,
    //     amount,
    //     description,
    //     date,
    //   });
  
      // Create a transaction for the expense
      const transaction = await Transaction.create({
        amount: amount, 
        type: 'credit', 
        purpose: category,
        description: `Revenue:${description ? description : ''}`, 
        date,
      });
  
      res.status(201).send({ transaction });
    } catch (error) {
      res.status(400);
      throw new Error(error);
    }
  });







export { getTotalRevenue, getRecentTransactions, getTransactionsInfo, addRevenue };
