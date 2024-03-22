import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            enum: ['credit', 'debit'], // Specify whether it's a credit or debit transaction
            required: true
        },
        description: {
            type: String,
        },
        date: {
            type: Date,
            required: true
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NiosStudent' // Reference to the student for credit transactions
        }
    },
    {
        timestamps: true
    }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export { Transaction };
