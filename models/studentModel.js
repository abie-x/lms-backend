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
        admissionFees: {
            type: Number,
            required: true
        }, 
        admissionFeePaid: {
            type: Boolean,
            required: true,
            default: false
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
                paidAmount: {
                    type: Number,
                    required: true,
                    default: 0
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
        },
        results: {
            type: String,
        },
        feeDetails: feeDetailsSchema,
        admissionCoordinator: {
            type: String,
            required: true
        },
        examCentre: {
            type: String,
        },
        deleteRequested: {
            type: Boolean,
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
            enum: ['Online', 'Offline', 'Correspondent'] //add correspondent student in this enum..
        },
        branch: {
            type: String,
            required: true
        },
        referenceNumber: {
            type: String,
        },
        enrollmentNumber: {
            type: String,
        },
        status: {
            type: String,
            required: true,
            default: 'Admitted',
            enum: ['Fail', 'Pass', 'Dropout', 'Admitted', 'Other']
        },
        registrationStream: {
            type: String,
            enum: ['Stream1', 'Stream2', 'Stream3', 'Stream4']
        },
        examMode: {
            type: String,
            enum: ['Normal exam', 'Ondemand exam']
        },
        exaMonth: { 
            type: String, //we might need to change the type to array of strings later. 
            enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        lastExamYear: {
            type: String,
        },
        onDemandExam: {
            type: Boolean,
            required: true,
            default: false
        },
        onDemandExamMonth: { 
            type: String, //we might need to change the type to array of strings later. 
            enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        onDemandSubjects: {
            type: [String],
        },
        subjects: {
            type: [String],
        },
        toc: {
            type: Boolean,
            required: true,
            default: false
        },
        optionalSubjectsExam: {
            type: Boolean,
            required: true,
            default: false
        },
        optionalSubjects: {
            type: [String],
        },
        tocSubjects: {
            type: [String],
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