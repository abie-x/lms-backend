import asyncHandler from 'express-async-handler';
import { NiosStudent } from '../models/studentModel.js';
import { NiosFee } from '../models/feeModel.js';
import { Transaction } from '../models/transactionModel.js';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fetch from 'node-fetch';

async function buildPdf(dataCallback, endCallback) {
    console.log('hey, cool')
    try {

        const doc = new PDFDocument();

        doc.fontSize(16);

        // const __filename = fileURLToPath(import.meta.url);
        // const __dirname = dirname(__filename);

        // const logoPath = path.join(__dirname, '..', 'linfield-logo.png');// Replace with the actual path to your logo image
        
        // const __filename = fileURLToPath(import.meta.url);
        // const __dirname = path.dirname(__filename);
        
        // const logoPath = path.join(process.cwd(), 'controllers', 'linfield-logo.png');

        const imageUrl = 'https://w7.pngwing.com/pngs/326/85/png-transparent-google-logo-google-text-trademark-logo.png'

        async function downloadImage(url) {
            const response = await fetch(url);
            const buffer = await response.arrayBuffer();
            return buffer;
        }

        const imageBuffer = await downloadImage(imageUrl);

        doc.image(imageBuffer, 50, 20, { width: 100, align: 'center' });

        // doc.image(logoPath, 50, 20, { width: 100, align: 'center' });


        // Add 'INVOICE' in the top-right corner
        doc.text('INVOICE', 450, 100, { align: 'right' });  

        // Set the font size for the rest of the content
        doc.fontSize(12);

        // Add left-aligned text
        doc.text('Invoice Date:', 50, 130);
        doc.text('Northland Academy', 50, 130,  { align: 'right' });
        doc.text('Invoice No.:', 50, 150);
        doc.text('Phone: 9567335361', 50, 150,  { align: 'right' });

        const columnNames = ['Item No', 'Item Description', 'Quantity', 'Unit Price', 'Total Amount'];

        // Set the initial position for the table
        let yPosition = 200;

        // Set cell width and height
        const cellWidth = 100;
        const cellHeight = 20;

        // Add the table headers with borders
        columnNames.forEach((columnName, index) => {
        // Draw the cell with a border
        doc.rect(50 + index * cellWidth, yPosition, cellWidth, cellHeight).stroke();
        doc.text(columnName, 50 + index * cellWidth + 5, yPosition + 5, { bold: true });
        });

        // Add sample data
        const sampleData = [
        { itemNo: '001', itemDescription: 'Product A', quantity: 5, unitPrice: 10, totalAmount: 50 },
        { itemNo: '002', itemDescription: 'Product B', quantity: 3, unitPrice: 15, totalAmount: 45 }
        ];

        // Set the position for the data rows
        yPosition += cellHeight;

        // Add the sample data to the table with borders
        sampleData.forEach((data, rowIndex) => {
            Object.values(data).forEach((value, columnIndex) => {
                // Draw the cell with a border
                doc.rect(50 + columnIndex * cellWidth, yPosition + rowIndex * cellHeight, cellWidth, cellHeight).stroke();
                doc.text(value.toString(), 50 + columnIndex * cellWidth + 5, yPosition + rowIndex * cellHeight + 5);
            });
        });

        // Return a promise to handle asynchronous PDF generation
        const pdfBuffer = await new Promise((resolve) => {
            const buffers = [];
            doc.on('data', buffer => {
                dataCallback && dataCallback(buffer); // Invoke the dataCallback if provided
                buffers.push(buffer);
            });
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
                endCallback && endCallback(); // Invoke the endCallback if provided
            });
            doc.end();  // Trigger the 'end' event
        });

        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'abhiramzmenon@gmail.com',
                pass: 'rsgwlnlrmsthvwqt'
            }
        });

        // Setup email data with unicode symbols
        const mailOptions = {
            from: 'abhiramzmenon@gmail.com',
            to: 'apespotdigital@gmail.com',
            subject: 'Testing node mailer',
            text: 'Please find the attached invoice.',
            attachments: [
                {
                    filename: 'invoice.pdf',
                    content: pdfBuffer,
                    encoding: 'base64',
                },
            ],
        };

        // Send mail with defined transport object
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);

        console.log('Invoice sent successfully.');
    } catch (error) {
        console.error('Error:', error);
    }
}

// desc  => create a new NIOS student
//route => /api/students/nios
//access => public
const createNiosStudent = asyncHandler(async (req, res) => {

  const {
    name,
    place,
    year,
    course,
    batch,
    intake,
    mode,
    phoneNumber,
    parentNumber,
    dob,
    email,
    branch,
    admissionCoordinator
  } = req.body;


  //check if a student with the same email id exists
  const studentExist = await NiosStudent.findOne({phoneNumber})

  if(studentExist) {
    res.status(400)
    throw new Error('Given phone number already exists in the database')
  }

  // Fetch NiosFee based on the provided intake, course, batch, and year
  const query = {
    intake,
    course,
    year,
    mode,
  };

  console.log(batch)

  if (batch !== undefined && batch !== null && batch !== '') {
    query.batch = batch;
  }

  console.log(query)

    const niosFee = await NiosFee.findOne(query);

    console.log(niosFee)

    if(niosFee) {
        const { installments, examFees, registrationFees, totalAmount } = niosFee

        const studentQuery = {
                name,
                place,
                year,
                course,
                intake,
                mode,
                phoneNumber,
                parentNumber,
                dob,
                email,
                branch,
                admissionCoordinator,
                feeDetails: {
                    totalAmount,
                    registrationFees,
                    examFees,
                    installments,
                },
        }

        if (batch !== undefined && batch !== null && batch !== '') {
            studentQuery.batch = batch;
          }

        const niosStudent = await NiosStudent.create(studentQuery)

        // const stream = res.writeHead(200, {
        //     'Content-Type': 'application/pdf',
        //     'Content-Disposition': 'attachment;filename=invoice.pdf'
        // })
        // res.write(niosStudent);
        // await buildPdf(
        //     (chunk) => stream.write(chunk),
        //     () => stream.end()
        // )
        res.status(201).send(niosStudent)
        await buildPdf()
    } else {
        // res.status(404)
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
    const { phoneNumber, feeType, installmentNumber, amount } = req.body;

    console.log(phoneNumber)
    console.log(feeType)
    console.log(installmentNumber)
    console.log(amount)

    // Find the student based on phoneNumber or email
    let student;

    if (phoneNumber) {
        student = await NiosStudent.findOne({ phoneNumber });
    }

    if (!student) {
        throw new Error('Student not found');
    }

    // Extract the student's details
    const { intake, course, batch, year, mode } = student;

    // Determine the appropriate fees based on student's details
    const feeQuery = {
        intake,
        course,
        year,
        mode
    }

    

    if (batch !== undefined && batch !== null && batch !== '') {
        feeQuery.batch = batch;
      }

    const niosFee = await NiosFee.findOne(feeQuery);


    if (!niosFee) {
        throw new Error('Unable to fetch NIOS fee for this student');
    }

    if (feeType === 'examFees') {
        console.log('iam part of exam fee payment')
        console.log(feeType)
        if (student.feeDetails.examFeePaid) {
            throw new Error('Exam fee already paid by the student');
        } else {
            console.log('iam the else condition')
            student.feeDetails.examFeePaid = true;
            const examFeeAmount = niosFee.examFees; // Get the exam fee amount from the fee schema
            student.feeDetails.paidAmount += examFeeAmount
            createTransaction(student._id, examFeeAmount, feeType); // Create a new transaction
        }  
    } else if (feeType === 'registrationFees') {
        console.log('hey, iam part of registrationfee')
        console.log(feeType)
        if (student.feeDetails.registrationFeePaid) {
            throw new Error('Registration fee already paid by the student');
        } else {
            console.log('iam the else condition')
            student.feeDetails.registrationFeePaid = true;
            const regFeeAmount = niosFee.registrationFees; // Get the registration fee amount from the fee schema
            student.feeDetails.paidAmount += regFeeAmount
            createTransaction(student._id, regFeeAmount, feeType); // Create a new transaction
        }
    } else {
        console.log('hey theree!!')
        const installmentToPay = student.feeDetails.installments.find(
            (installment) => installment.installmentNumber === installmentNumber
        );

        if (installmentToPay) {
            if (installmentToPay.isPaid === true) {
                throw new Error('Student already paid this installment');
            } else {
                // if(installmentToPay.amount === amount) {
                //     installmentToPay.isPaid = true;
                // }
                console.log(installmentToPay)
                let outstandingAmount = installmentToPay.amount - installmentToPay.paidAmount
                console.log('outstanding amount', outstandingAmount)
                if(outstandingAmount === amount) {
                    installmentToPay.isPaid = true;
                }
                console.log('printing the paidAmount')
                console.log(installmentToPay.paidAmount)
                  
                installmentToPay.paidAmount += amount;
                student.feeDetails.paidAmount += amount;
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
        status: 'success'
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
        throw new Error(`Student doesn't exists for this Phone Number`)
    }
})

//desc => fetch student data by id
//route => /api/students/:id
//access => public
const fetchStudentDetailsById = asyncHandler(async (req, res) => {
    const {id} = req.params

    console.log(id)

    const student = await NiosStudent.findById(id)

    if(student) {
        res.status(200).send(student)
    } else {
        throw new Error(`Student doesn't exist for the given id`)
    }
})

//update an existing student
//action plan: step1 => get the phonenumber from the student.
//step2 => get the stream, exam mode, enrollment number and year of last exam
//step3: add these details and modify the existing student details
//step4: if success, send the response back to the customer
const updateExistingStudent = asyncHandler(async (req, res) => {

    const studentId = req.params.id
    const updatedFields = req.body;

    const student = await NiosStudent.findByIdAndUpdate(studentId, {
        $set: updatedFields
    }, { new: true });

    console.log(student)

    if (student) {
        res.status(200).send(student);
    } else { 
        res.status(400).send('Student not found');
    }
});


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
    fetchStudentDetailsById,
    updateStudent,
    getStudentsWithUnpaidFees,
    getStudentsCreatedToday,
    updateExistingStudent,
};
