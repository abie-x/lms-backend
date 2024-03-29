import express from "express";
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import cors from 'cors'

//importing the routes in the application
import teacherRoutes from './routes/teacherRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import generalRoutes from './routes/generalRoutes.js'

//defining to use env variables in the project
dotenv.config()

//connecting the mongodb database with the express server
connectDB()

//creating a new instance of express app
const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/teachers', teacherRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/course', courseRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/expense', expenseRoutes)
app.use('/api/general', generalRoutes)

//declaring the error handler and not found middlewares
app.use(notFound)
app.use(errorHandler)

//defining the PORT variable
const PORT = process.env.PORT || 5000

//secret key: sk_test_51O1MCkKoYFAYewxjwG6lWJXkhL1tlkHctvYBtwQpOO4x8xtNZww5xl1ydaOKvXLFKXT2ZVnjOHvMQeRhIoVMkIdg00jSK5BAP4

app.listen(PORT, console.log(`server is running on port ${PORT}`.green.bold))