import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Salary', 'Rent', 'Printing & Stationary', 'Refreshment', 'Electricity', 'Repairs', 'Equipments', 'Miscellaneous Expense', 'Exam Fees', 'Registration Fees'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
