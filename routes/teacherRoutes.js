import express from 'express'
const router = express.Router()
import { loginTeachers, testTeacherApi, registerTeachers, getTeacherData, resetPassword, deleteTeacher } from '../controllers/teacherController.js'
import { protect, admin } from '../middlewares/authMiddleware.js'

//we need to import the admin middleware here.

router.get('/details', protect, admin, getTeacherData)
router.delete('/:id', protect, admin, deleteTeacher)
router.post('/register', protect, admin, registerTeachers)
router.post('/login', loginTeachers)
router.put('/reset/:id', protect, admin, resetPassword )
router.get('/test', testTeacherApi)

export default router