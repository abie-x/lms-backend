import express from 'express'
import { createNiosStudent, niosFeePay, getStudentDetails, updateStudent, getStudentsWithUnpaidFees, getStudentsCreatedToday, updateExistingStudent, fetchStudentDetailsById, getNumberOfAdmissions, getRecentAdmissions, getAdmissionsInfo, filterNiosStudents, getStudentByNumber, getStudentTransactions, getLatestAdmissionsCount } from '../controllers/studentController.js'
import { protect, admin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/totalAdmissions', getNumberOfAdmissions)
router.get('/recentAdmissions', getRecentAdmissions)
router.get('/details', getStudentDetails)
router.post('/nios', createNiosStudent)
router.put('/fees/nios', niosFeePay)
router.get('/unpaid-fees/:feeType', getStudentsWithUnpaidFees);
router.get('/unpaid-fees/:feeType/:installmentNumber', getStudentsWithUnpaidFees);
router.put('/updateExisting', updateExistingStudent)
router.put('/:id', updateStudent)
router.get('/new-admissions', protect, admin, getStudentsCreatedToday)
router.get('/admissions/info', getAdmissionsInfo)
router.post('/filterStudents', filterNiosStudents)
router.get('/search/:number', getStudentByNumber)
router.get('/studentTransactions/:number', getStudentTransactions)
router.get('/latestAdmissions', getLatestAdmissionsCount)
router.get('/:id', fetchStudentDetailsById)

export default router