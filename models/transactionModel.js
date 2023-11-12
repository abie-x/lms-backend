import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true
        },
        feeType: {
            type: String,
            required: true
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NiosStudent'
        }
    }, 
    {
        timestamps: true
    }
)

const Transaction = mongoose.model('Transaction', transactionSchema)

export {
    Transaction
}