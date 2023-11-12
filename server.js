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

//declaring the error handler and not found middlewares
app.use(notFound)
app.use(errorHandler)

//defining the PORT variable
const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`server is running on port ${PORT}`.green.bold))