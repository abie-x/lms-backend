import asyncHandler from "express-async-handler";
import { Teacher } from "../models/teacherModel.js";
import { generateToken } from "../utils/generateToken.js";


//desc => signup admin user
//route => POST /api/teachers/admin
//access => private(admin)
const registerAdmin = asyncHandler(async (req, res) => {
    const {name, phoneNumber, email, password } = req.body

    console.log(email)
    console.log(password)

    const adminExist = await Teacher.findOne({email})

    if(adminExist) {
        res.status(400)
        throw new Error('Teacher already exists')
    }

    const admin = await Teacher.create({
        name,
        phoneNumber,
        email,
        password,
        isAdmin: true
    })

    if(admin) {
        res.status(201).json({
            _id: admin.id,
            name: admin.name,
            phoneNumber: admin.phoneNumber,
            email: admin.email,
            isAdmin: admin.isAdmin,
            token: generateToken(admin._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

//desc => Login admin user and get token
//route => POST /api/teachers/admin/login
//access => Private (admin only)
const loginAdmin = asyncHandler(async (req, res) => {
    const {phoneNumber, password} = req.body

    const admin = await Teacher.findOne({phoneNumber})

    if(admin && await admin.matchPassword(password)) {
        res.status(200).json(
            {
                _id: admin._id,
                name: admin.name,
                phoneNumber: admin.phoneNumber,
                isAdmin: admin.isAdmin,
                token: generateToken(admin._id)
            }
        )
    } else {
        res.status(400)
        throw new Error('Invalid phoneNumber or password')
    }
})

//desc => Signup new teacher and get token
//route => POST /api/teachers/register
//access => private (admin only)
const registerTeachers = asyncHandler(async (req, res) => {
    const {name, phoneNumber, email, password } = req.body

    console.log(email)
    console.log(password)

    const teacherExist = await Teacher.findOne({email})

    if(teacherExist) {
        res.status(400)
        throw new Error('Teacher already exists')
    }

    const teacher = await Teacher.create({
        name,
        phoneNumber,
        email,
        password,
    })

    if(teacher) {
        res.status(201).json({
            _id: teacher.id,
            name: teacher.name,
            phoneNumber: teacher.phoneNumber,
            email: teacher.email,
            isAdmin: teacher.isAdmin,
            token: generateToken(teacher._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})


//desc => Login teachers and get token
//route => POST /api/teachers/login
//access => public
const loginTeachers = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    console.log(email)

    const teacher = await Teacher.findOne({email})

    console.log(teacher)

    if(teacher && await teacher.matchPassword(password)) {
        res.status(200).json({
            _id: teacher._id,
            name: teacher.name,
            phoneNumber: teacher.phoneNumber,
            email: teacher.email,
            isAdmin: teacher.isAdmin,
            token: generateToken(teacher._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid email or password')
    }
})

//desc => retreive the data of a particular teacher
//route => /api/teachers/:id
//access => admin (admin only)
const resetPassword = asyncHandler(async (req, res) => {
    const {password} = req.body

    const teacherId = req.params.id

    const teacher = await Teacher.findById(teacherId)

    if(teacher) {
        teacher.password = password
        await teacher.save()
        res.status(204).send(teacher)
    } else {
        res.status(404)
        throw new Error('Teacher not found')
    }

})

const getTeacherData = asyncHandler(async (req, res) => {
    const {phoneNumber} = req.query

    const teacher = await Teacher.findOne({phoneNumber})

    if(teacher) {
        res.status(200).send(teacher)
    } else {
        res.status(404)
        throw new Error('Teacher not found')
    }
})

//desc => delete a teacher data
//route => /api/teachers/delete
//access => private (admin only)
const deleteTeacher = asyncHandler(async (req, res) => {
    const teacherId = req.params.id

    const teacher = await Teacher.findById(teacherId)

    if(teacher) {
        await Teacher.deleteOne({_id: teacherId})
        res.status(200).json({
            message: 'Teacher deleted successfully'
        })
    } else {
        res.status(404)
        throw new Error('Teacher not found')
    }
})

//desc => reset password of a teacher
//route => /api/teachers/reset
//access => private(admin only)

//testapi route creating to test if the api's are working correctly
const testTeacherApi = asyncHandler(async (req, res) => {
    res.status(200).send("API working correctly")
})

export {
    loginAdmin,
    registerAdmin,
    registerTeachers,
    loginTeachers,
    testTeacherApi,
    getTeacherData,
    resetPassword,
    deleteTeacher
}

