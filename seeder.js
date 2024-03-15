import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import { NiosStudent } from './models/studentModel.js'
import { testNiosStudents } from './data/niosStudents.js'
import { NiosFee } from './models/feeModel.js'
import { testFeeData } from './data/feeData.js'
import { testTeachers } from './data/teachers.js'
import { Teacher } from './models/teacherModel.js'
import { Transaction } from './models/transactionModel.js'
import connectDB from './config/db.js'

dotenv.config()

connectDB()

const importData = async () => {
  try {
    await NiosStudent.deleteMany()
    await NiosFee.deleteMany()
    await Teacher.deleteMany()

    await NiosStudent.insertMany(testNiosStudents)
    await NiosFee.insertMany(testFeeData)
    await Teacher.insertMany(testTeachers)

    console.log('Data Imported!'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    // await NiosStudent.deleteMany()
    // await NiosFee.deleteMany()
    await Teacher.deleteMany()

    // await Transaction.deleteMany()

    console.log('Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}