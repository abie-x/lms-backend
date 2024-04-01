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
            enum: ['Online', 'Offline', 'Correspondent']
        },
        examFees: {
            type: Number,
            //modified the required flag here
        },
        registrationFees: {
            type: Number,
            // required: true - modified required flag here
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
        },
        registrationFeeDueDate: {
            type: Date,
            // required: true - modified the registrationFeeDueDate
        },
        installments: [
            {
                installmentNumber: {
                    type: Number,
                },
                dueDate: {
                    type: Date,
                },
                amount: {
                    type: Number,
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