import mongoose from "mongoose";

const niosFeeSchema = new mongoose.Schema(
    {
        year: { //year, batch, course, mode
            type: Number,
            required: true
        },
        intake: {
            type: String,
            required: true,
            enum: ['April', 'September']
        },
        batch: {
            type: String,
            enum: ['Science', 'Commerce', 'Humanities', null]
        },
        course: {
            type: String,
            required: true,
            enum: ['SSLC', 'Plustwo']
        },
        mode: {
            type: String,
            required: true,
            enum: ['Online', 'Offline']
        },
        examFees: {
            type: Number,
            required: true,
        },
        registrationFees: {
            type: Number,
            required: true
        },
        totalAmount: {
            type: Number,
            required: true
        },
        admissionFees: {
            type: Number,
            required: true
        },
        admissionFeeDueDate: {
            type: Date,
            required: true
        },
        examFeeDueDate: {
            type: Date,
            required: true
        },
        registrationFeeDueDate: {
            type: Date,
            required: true
        },
        installments: [
            {
                installmentNumber: {
                    type: Number,
                    required: true
                },
                dueDate: {
                    type: Date,
                    required: true
                },
                amount: {
                    type: Number,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

const NiosFee = mongoose.model('NiosFee', niosFeeSchema)

export {
    NiosFee
}