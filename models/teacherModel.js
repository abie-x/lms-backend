import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const teachersSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        },
        role: {
            type: String,
            required: true,
            enum: ['Admin', 'GM', 'Tutor']
        }
    }, 
    {
        timestamps: true
    }
)

teachersSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

teachersSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next()
    }
  
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

//create a new Teacher model
const Teacher = mongoose.model('Teacher', teachersSchema)

export {
    Teacher
}