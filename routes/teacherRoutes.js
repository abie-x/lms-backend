import express from 'express'
const router = express.Router()
import { loginTeachers, testTeacherApi, registerTeachers, getTeacherData, resetPassword, deleteTeacher, showAllTeachers, deleteTeacherHandler} from '../controllers/teacherController.js'
import { protect, admin } from '../middlewares/authMiddleware.js'

//we need to import the admin middleware here.

router.get('/details', protect, admin, getTeacherData)
router.get('/showAll', showAllTeachers)
router.post('/register', registerTeachers)
router.post('/login', loginTeachers)
router.put('/reset/:id', protect, admin, resetPassword )
router.delete('/delete/:teacherId', deleteTeacherHandler)
router.get('/test', testTeacherApi)

export default router