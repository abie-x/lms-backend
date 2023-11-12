import asyncHandler from 'express-async-handler';
import { NiosStudent } from '../models/studentModel.js';
import { NiosFee } from '../models/feeModel.js';
import { Transaction } from '../models/transactionModel.js';

// desc  => create a new NIOS student
//route => /api/students/nios
//access => public
const createNiosStudent = asyncHandler(async (req, res) => {

  const {
    name,
    place,
    dob,
    phoneNumber,
    parentNumber,
    email,
    password,
    results,
    admissionCoordinator,
    course,
    intake,
    batch,
    mode,
    referenceNumber,
    enrollmentNumber,
    status,
    onDemandExamMonth,
    subjects,
    toc,
    year, // Include year in the request to check against NiosFee
  } = req.body;

  //check if a student with the same email id exists
  const studentExist = await NiosStudent.findOne({phoneNumber})

  if(studentExist) {
    res.status(400)
    throw new Error('Given phone number already exists in the database')
  }

  // Fetch NiosFee based on the provided intake, course, batch, and year
    const niosFee = await NiosFee.findOne({
        intake,
        course,
        batch,
        year,
        mode
    });

    if(niosFee) {
        const { installments, examFees, registrationFees, totalAmount } = niosFee

        const niosStudent = await NiosStudent.create(
            {
                name,
                place,
                dob,
                phoneNumber,
                parentNumber,
                email,
                password,
                results,
                admissionCoordinator,
                year,
                course,
                intake,
                batch,
                mode,
                referenceNumber,
                enrollmentNumber,
                status,
                onDemandExamMonth,
                subjects,
                toc,
                feeDetails: {
                    totalAmount,
                    registrationFees,
                    examFees,
                    installments,
                },
            }
        )
        res.status(201).send(niosStudent)
    } else {
        res.status(404)
        throw new Error(`Nios fee doesnt found for the specific criteria`)
    }

})

//desc => create a new fee record for nios student
//route => /api/students/fees/nios
//access => public
// const niosFeePay = asyncHandler(async (req, res) => {
//     const { phoneNumber, email, feeType, installmentNumber } = req.body;

//     console.log(phoneNumber)
//     console.log(email)

//     // Find the student based on phoneNumber or email
//     let student;

//     if (phoneNumber) {
//       console.log('im executing ion behalf of phone number')
//       student = await NiosStudent.findOne({ phoneNumber });
//     } else if (email) {
//       console.log('Iam executing on behalf of email')
//       student = await NiosStudent.findOne({ email });
//     }

//     if(!student) {
//         res.status(404)
//         throw new Error('Student not found')
//     }

//     // Extract the student's details
//     const { intake, course, batch, year } = student;

//     // Determine the appropriate fees based on student's details
//      const niosFee = await NiosFee.findOne({
//         intake,
//         course,
//         batch,
//         year,
//     });

//     if(!niosFee) {
//         res.status(404)
//         throw new Error(`Unable to fetech NIOS fee for this student`)
//     }

//     if(feeType === 'registrationFees') {
//         if(student.feeDetails.registrationFeePaid) {
//             res.status(400)
//             throw new Error('Registration fee already paid by the student')
//         } else {
//             student.feeDetails.registrationFeePaid = true
//         }
        
//     } else if(feeType === 'examFees') {
//         if(student.feeDetails.examFeePaid) {
//             res.status(400)
//             throw new Error('Exam fee already paid by the student')
//         } else {
//             student.feeDetails.examFeePaid = true
//         }
//     } else {
//         // Find the installment in the student's feeDetails.installments array by installmentNumber
//         const installmentToPay = student.feeDetails.installments.find(
//             (installment) => installment.installmentNumber === installmentNumber
//         );

//         if (installmentToPay) {
//             if(installmentToPay.isPaid === true) {
//                 res.status(400)
//                 throw new Error('Student already paid this installment')
//             } else {
//                 installmentToPay.isPaid = true;
//                 student.feeDetails.paidAmount += installmentToPay.amount
//             }
//         } else {
//             return res.status(404).json({ message: 'Installment not found' });
//         }
//     }

//     //save the student record
//     await student.save()

//     res.status(200).json(
//         {
//             message: 'Fees added successfully'
//         }
//     )
// })

//----------
const niosFeePay = asyncHandler(async (req, res) => {
    const { phoneNumber, email, feeType, installmentNumber } = req.body;

    // Find the student based on phoneNumber or email
    let student;

    if (phoneNumber) {
        student = await NiosStudent.findOne({ phoneNumber });
    } else if (email) {
        student = await NiosStudent.findOne({ email });
    }

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    // Extract the student's details
    const { intake, course, batch, year, mode } = student;

    // Determine the appropriate fees based on student's details
    const niosFee = await NiosFee.findOne({
        intake,
        course,
        batch,
        year,
        mode
    });

    if (!niosFee) {
        res.status(404);
        throw new Error('Unable to fetch NIOS fee for this student');
    }

    if (feeType === 'registrationFees') {
        if (student.feeDetails.registrationFeePaid) {
            res.status(400);
            throw new Error('Registration fee already paid by the student');
        } else {
            student.feeDetails.registrationFeePaid = true;
            const amount = niosFee.registrationFees; // Get the registration fee amount from the fee schema
            student.feeDetails.paidAmount += amount
            createTransaction(student._id, amount, feeType); // Create a new transaction
        }
    } else if (feeType === 'examFees') {
        if (student.feeDetails.examFeePaid) {
            res.status(400);
            throw new Error('Exam fee already paid by the student');
        } else {
            student.feeDetails.examFeePaid = true;
            const amount = niosFee.examFees; // Get the exam fee amount from the fee schema
            student.feeDetails.paidAmount += amount
            createTransaction(student._id, amount, feeType); // Create a new transaction
        }
    } else {
        const installmentToPay = student.feeDetails.installments.find(
            (installment) => installment.installmentNumber === installmentNumber
        );

        if (installmentToPay) {
            if (installmentToPay.isPaid === true) {
                res.status(400);
                throw new Error('Student already paid this installment');
            } else {
                installmentToPay.isPaid = true;
                student.feeDetails.paidAmount += installmentToPay.amount;
                createTransaction(student._id, installmentToPay.amount, feeType); // Create a new transaction
            }
        } else {
            return res.status(404).json({ message: 'Installment not found' });
        }
    }

    // Save the student record
    await student.save();

    res.status(200).json({
        message: 'Fees added successfully',
    });
});

// Helper function to create a new transaction
const createTransaction = async (studentId, amount, feeType) => {
    const newTransaction = new Transaction({
        amount,
        feeType,
        studentId,
    });

    await newTransaction.save();
};


//desc => get the details of a particular student
//route => /api/students/details?phoneNumber={phoneNumber}
//access => public
const getStudentDetails = asyncHandler(async (req, res) => {
    const {phoneNumber} = req.query

    const student = await NiosStudent.findOne({phoneNumber})

    if(student) {
        res.status(200).send(student)
    } else {
        res.status(400)
        throw new Error(`Student doesn't exists for this Phone Number`)
    }
})

//desc => Update the details of a particular student
//route => /api/students/:id
//access => public
const updateStudent = asyncHandler(async (req, res) => {
    const studentId = req.params.id 

    const updatedFields = req.body

    const student = await NiosStudent.findByIdAndUpdate(studentId, { $set: updatedFields }, { new: true });

    if(student) {
        res.status(200).send(student)
    } else {
        res.status(400)
        throw new Error('Error updating the student record')
    }
})

//desc => filter the students who hasnt paid fees (be it exam fees, registration fees or tuition fees)
//route => /api/students/unpaidfees
//access => public
// const getStudentsWithUnpaidFees = asyncHandler(async (req, res) => {
//     const { feeType, installmentNumber } = req.params;

//     // Define the filter based on the fee type (registration, exam, or installment)
//     let filter = {};
//     if (feeType === 'registrationFees') {
//         filter = { 'feeDetails.registrationFeePaid': false };
//     } else if (feeType === 'examFees') {
//         filter = { 'feeDetails.examFeePaid': false };
//     } else if (feeType === 'tuitionFees' && installmentNumber) {
//         filter = {
//             'feeDetails.installments': {
//                 $elemMatch: {
//                     installmentNumber: parseInt(installmentNumber),
//                     isPaid: false
//                 }
//             }
//         };
//     } else {
//         res.status(400);
//         throw new Error('Invalid feeType provided');
//     }

//     // Use Mongoose to find students based on the constructed filter
//     const studentsWithUnpaidFees = await NiosStudent.find(filter);

//     if (studentsWithUnpaidFees) {
//         res.status(200).json(studentsWithUnpaidFees);
//     } else {
//         res.status(404);
//         throw new Error(`No students found with unpaid ${feeType}`);
//     }
// });

//-------------
const getStudentsWithUnpaidFees = asyncHandler(async (req, res) => {
    const { feeType, installmentNumber } = req.params;
  
    if (feeType === 'all') {
      // Filter students whose paidAmount is less than totalAmount
      const studentsWithUnpaidFees = await NiosStudent.find({
        $expr: { $lt: ['$feeDetails.paidAmount', '$feeDetails.totalAmount'] },
      });
  
      res.status(200).json(studentsWithUnpaidFees);
    } else {
      // Define the filter based on the fee type (registration, exam, or installment)
      let filter = {};
      if (feeType === 'registrationFees') {
        filter = { 'feeDetails.registrationFeePaid': false };
      } else if (feeType === 'examFees') {
        filter = { 'feeDetails.examFeePaid': false };
      } else if (feeType === 'tuitionFees' && installmentNumber) {
        filter = {
          'feeDetails.installments': {
            $elemMatch: {
              installmentNumber: parseInt(installmentNumber),
              isPaid: false,
            },
          },
        };
      } else {
        res.status(400);
        throw new Error('Invalid feeType provided');
      }
  
      // Use Mongoose to find students based on the constructed filter
      const studentsWithUnpaidFees = await NiosStudent.find(filter);
  
      res.status(200).json(studentsWithUnpaidFees);
    }
});
  

//desc => get the no of students who took admission today
//route => /api/students/admissions-count
//access => private (admin only)
const getStudentsCreatedToday = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

    const totalNewStudents = await NiosStudent.countDocuments({
        createdAt: { $gte: today },
    });

    res.status(200).json({ totalNewStudents });
})


export { 
    createNiosStudent,
    niosFeePay,
    getStudentDetails,
    updateStudent,
    getStudentsWithUnpaidFees,
    getStudentsCreatedToday
};
