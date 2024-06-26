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
        admissionFeePaidAmount: {
            type: Number,
        },
        registrationFees: {
            type: Number,
        },
        registrationFeePaid: {
            type: Boolean,
            required: true,
            default: false
        },
        examFees: {
            type: Number,
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
                },
                dueDate: {
                    type: Date,
                },
                amount: {
                    type: Number,
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
        ],
        customFees: [
            {
                feeName: {
                    type: String
                },
                amount: {
                    type: Number
                }
            }
        ]
    },
  );


//define the Base studentSchema
const studentSchema = new mongoose.Schema(
    {
        admissionNumber: {
            type: Number,
            unique: true
        },
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
        registrationStatus: {
            type: String,
            required: true,
            default: 'NotRegistered',
            enum: ['Registered', 'NotRegistered']
        },
        academicStatus: {
            type: String,
            required: true,
            default: 'Pursuing',
            enum: ['Pass', 'Fail', 'Cancelled', 'PartiallyCancelled', 'Pursuing']
        },
        reasonForCancellation: {
            type: String
        },
        registrationStream: {
            type: String,
            enum: ['Stream1', 'Stream2', 'Stream3', 'Stream4']
        },
        examMode: {
            type: String,
            enum: ['Normal exam', 'Ondemand exam']
        },
        examMonth: { 
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
        tocReceived: {
            type: Boolean,
            required: true,
            default: false
        },
        tocSubmitted: {
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
        },
        
        tmaReceived: {
            type: Boolean,
            required: true,
            default: false
        },
        tmaSubmitted: {
            type: Boolean,
            required: true,
            default: false
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