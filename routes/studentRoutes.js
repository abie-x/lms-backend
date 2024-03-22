import express from 'express'
import { createNiosStudent, niosFeePay, getStudentDetails, updateStudent, getStudentsWithUnpaidFees, getStudentsCreatedToday, updateExistingStudent, fetchStudentDetailsById, getNumberOfAdmissions } from '../controllers/studentController.js'
import { protect, admin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/totalAdmissions', getNumberOfAdmissions)
router.get('/details', getStudentDetails)
router.get('/:id', fetchStudentDetailsById)
router.post('/nios', createNiosStudent)
router.put('/fees/nios', niosFeePay)
router.get('/unpaid-fees/:feeType', getStudentsWithUnpaidFees);
router.get('/unpaid-fees/:feeType/:installmentNumber', getStudentsWithUnpaidFees);
router.put('/:id', updateStudent)
router.put('/updateExisting/:id', updateExistingStudent)
router.get('/new-admissions', protect, admin, getStudentsCreatedToday)

export default router