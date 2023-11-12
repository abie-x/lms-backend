import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

//define the fee details schema
const feeDetailsSchema = new mongoose.Schema(
    {
        totalAmount: {
            type: Number,
            required: true
        },
        paidAmount: {
            type: Number,
            required: true,
            default: 0
        },  
        registrationFees: {
            type: Number,
            required: true
        },
        registrationFeePaid: {
            type: Boolean,
            required: true,
            default: false
        },
        examFees: {
            type: Number,
            required: true 
        },
        examFeePaid: {
            type: Boolean,
            required: true,
            default: false
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
                },
                isPaid: {
                    type: Boolean,
                    required: true,
                    default: false
                }
            }
        ]
    },
  );


//define the Base studentSchema
const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        place: {
            type: String,
            required: true
        },
        dob: {
            type: Date,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        parentNumber: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        results: {
            type: String,
            required: false
        },
        feeDetails: feeDetailsSchema,
        admissionCoordinator: {
            type: String,
            required: true
        },
        examCentre: {
            type: String,
            required: false
        },
        deleteRequested: {
            type: Boolean,
            default: false
        }
    }
)


//define the NIOS studentschema
const niosStudentSchema = new mongoose.Schema(
    {
        year: {
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
            required: true,
            enum: ['Science', 'Commerce', 'Humanities']
        },
        course: {
            type: String,
            required: true,
            enum: ['SSLC', 'Plustwo']
        },
        mode: {
            type: String,
            required: true,
            enum: ['Online', 'Offline'] //add correspondent student in this enum..
        },
        referenceNumber: {
            type: String,
            required: true
        },
        enrollmentNumber: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: false,
            enum: ['Fail', 'Pass', 'Dropout', 'Other']
        },
        onDemandExamMonth: { 
            type: String, //we might need to change the type to array of strings later. 
            required: false,
            enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        subjects: {
            type: [String],
            required: true
        },
        toc: {
            type: [String],
            required: false
        }
    },
    {
        timestamps: true
    }
)

//inheriting the Base student schema with the niosStudentSchema
niosStudentSchema.add(studentSchema)

niosStudentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next()
    }
  
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

//creating a new NIOS student model
const NiosStudent = mongoose.model('NiosStudent', niosStudentSchema)

//export the models
export {
    NiosStudent
}