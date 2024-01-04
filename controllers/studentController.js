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
import imageSize from 'image-size';
import fs from 'fs';
import { table } from 'console';


async function buildPdf(name, course, batch, phoneNumber, email, intake, admissionFees, examFees, examFeeDueDate, installments, registrationfees, registrationFeeDueDate) {
    console.log('hey, cool')
    console.log(email)

    // const inputDateString = registrationFeeDueDate
    // const dateObject = new Date(inputDateString)
    // const day = dateObject.getUTCDate().toString().padStart(2, '0');
    // const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    // const year = dateObject.getUTCFullYear();

    const getDates = (data) => {
        const dateObject = new Date(data)
        const day = dateObject.getUTCDate().toString().padStart(2, '0');
        const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const year = dateObject.getUTCFullYear();
        return `${day}-${month}-${year}`
        
    }

    // console.log(day)
    // console.log(month)
    // console.log(year)
     

        try {

            const doc = new PDFDocument();
    
            doc.fontSize(14);
            doc.fillColor('blue')
    
            // doc.image('/workspace/controllers/test.png', 250, 0, {fit: [100, 100], align: 'center' })
            doc.text('LINFIELD EDUVERSE', 70, 70, { align: 'center' })
    
            
    
            // const logoPath = path.join(__dirname, '..', 'google-icon.svg');// Replace with the actual path to your logo image
            
            // const __filename = fileURLToPath(import.meta.url);
            // const __dirname = path.dirname(__filename);
            
            
    
    
            
            
    
    
            // Add 'INVOICE' in the top-right corner
    
            // Set the font size for the rest of the content
            doc.fontSize(12);
    
            //Add left-aligned text
            // doc.text('Invoice Date:  22-08-2022', 50, 130);
            doc.fillColor('blue').text('Billed By', 50, 130, {align: 'right'})
            doc.fillColor('black')
            doc.font('Helvetica-Bold');
            doc.text('Linfield Eduverse', 50, 150,  { align: 'right', bold: true });
            doc.font('Helvetica');
            doc.text('Edappal road, Kumaranellur', 50, 170,  { align: 'right' });
            doc.text('kerala, 679534', 50, 190,  { align: 'right' });
            doc.text('9567335361', 50, 210,  { align: 'right' });
    
    
            doc.fillColor('blue').text('Billed to', 50, 130)
            doc.fillColor('black')
            doc.text(name, 50, 150)
            doc.text(`${course} ${batch ? batch : ''} (${intake})`, 50, 170)
            doc.text(email, 50, 190)
            doc.text(phoneNumber, 50, 210)
    
            // doc.fontSize(12)
            // doc.text(`Hey ${name}!`, 40, 110)
            // doc.text(`A hearty welcome to the Linfield family! We're absolutely delighted to have you on board as a new member of our vibrant academic community.`, 40, 130)
            // doc.text(`Your educational journey with us is about to unfold, and we're committed to making it an experience filled with knowledge, growth, and memorable moments. As you set foot into the world of learning, we want to ensure that you have all the information you need regarding the fee structure for the upcoming academic session.`), 40, 150
    
            
    
            doc.strokeColor('blue');
            const lineY = doc.y + 20
            doc.moveTo(50, lineY).lineTo(550, lineY).stroke();
            doc.strokeColor('black');
    
            const tableY = lineY + 30
            doc.fontSize(12)
            doc.fillColor('blue')
            // doc.text('Fee Type', 50, tableY, { align: 'left' });
            // doc.text('Payment Type', 200, tableY, { align: 'left' });
            // doc.text('Amount', 350, tableY, { align: 'left' });
            // doc.text('Payment ID', 450, tableY, { align: 'left' });
    
            doc.text('Fee Type', 50, tableY)
            doc.text('Amount', 275, tableY)
            doc.text('Due date', 475, tableY)
    
            doc.fillColor('black')
    
            doc.text('Admission fees', 50, tableY + 20)
            doc.text(admissionFees, 280, tableY + 20)
            doc.text('Paid', 475, tableY + 20)
    
            doc.text('First Term fees', 50, tableY + 40)
            doc.text(installments[0].amount, 280, tableY + 40)
            doc.text(getDates(installments[0].dueDate), 475, tableY + 40)
    
            doc.text('Second Term fees', 50, tableY + 60)
            doc.text(installments[1].amount, 280, tableY + 60)
            doc.text(getDates(installments[1].dueDate), 475, tableY + 60)
    
            doc.text('Third Term fees', 50, tableY + 80)
            doc.text(installments[2].amount, 280, tableY + 80)
            doc.text(getDates(installments[2].dueDate), 475, tableY + 80)
    
            doc.text('Registration fees', 50, tableY + 100)
            doc.text(registrationfees, 280, tableY + 100)   
            doc.text(getDates(installments[2].dueDate), 475, tableY + 100)
    
            doc.text('Exam fees', 50, tableY + 120)
            doc.text(examFees, 280, tableY + 120)   
            doc.text(getDates(examFeeDueDate), 475, tableY + 120)
    
            doc.fontSize(12)
            // doc.text('Registration Fees', 50, tableY + 20, { align: 'left' });
            // doc.text('Online', 220, tableY + 20, { align: 'left' });
            // doc.text('2000', 360, tableY + 20, { align: 'left' });
            // doc.text('X789123', 450, tableY + 20, { align: 'left' });
            // doc.fillColor('blue').text('Course', 70, 220)
            // doc.text('NIOS Humanities', 70, 240)
    
            doc.strokeColor('gray')
            doc.moveTo(50, tableY + 160).lineTo(550, tableY + 160).stroke();
            doc.strokeColor('black');
    
            doc.fillColor('blue')
    
            //printing the total and balance
            doc.text('Total paid: ', 50, tableY + 180)
            doc.text('Balance to pay: ', 300, tableY + 180)
    
            doc.fillColor('black')
            
            doc.text('500 /-', 110, tableY + 180)
            doc.text('7900 /-', 390, tableY + 180)
    
            // Add notes section
            doc.text('Notes:', 50, tableY + 230, { underline: true })
            doc.text('- The amount paid is not refundable.', 50, tableY + 250);
            doc.text('- Any payments received after the specified due dates will be subject to a late fee. ', 50, tableY + 270)
            doc.text(`- Invoice generated on ${new Date()}`, 50, tableY + 290)
    
    
            // doc.fontSize(12)
            // doc.fillColor('blue')
            // doc.text('Course Fee', 50, tableY + 60)
            // doc.text('Balance', 290, tableY + 60)
            // doc.fontSize(10)
            // doc.fillColor('black')
            // doc.text('7000', 60, tableY + 80)
            // doc.text('3900', 300, tableY + 80)
    
            
    
            // const columnNames = ['Item No', 'Item Description', 'Quantity', 'Unit Price', 'Total Amount'];
    
            // // Set the initial position for the table
            // let yPosition = 200;
    
            // // Set cell width and height
            // const cellWidth = 100;
            // const cellHeight = 20;
    
            // // Add the table headers with borders
            // columnNames.forEach((columnName, index) => {
            // // Draw the cell with a border
            // doc.rect(50 + index * cellWidth, yPosition, cellWidth, cellHeight).stroke();
            // doc.text(columnName, 50 + index * cellWidth + 5, yPosition + 5, { bold: true });
            // });
    
            // // Add sample data
            // const sampleData = [
            // { itemNo: '001', itemDescription: 'Product A', quantity: 5, unitPrice: 10, totalAmount: 50 },
            // { itemNo: '002', itemDescription: 'Product B', quantity: 3, unitPrice: 15, totalAmount: 45 }
            // ];
    
            // // Set the position for the data rows
            // yPosition += cellHeight;
    
            // // Add the sample data to the table with borders
            // sampleData.forEach((data, rowIndex) => {
            //     Object.values(data).forEach((value, columnIndex) => {
            //         // Draw the cell with a border
            //         doc.rect(50 + columnIndex * cellWidth, yPosition + rowIndex * cellHeight, cellWidth, cellHeight).stroke();
            //         doc.text(value.toString(), 50 + columnIndex * cellWidth + 5, yPosition + rowIndex * cellHeight + 5);
            //     });
            // });
    
    
    
            // Return a promise to handle asynchronous PDF generation
            const pdfBuffer = await new Promise((resolve) => {
                const buffers = [];
                doc.on('data', buffer => {
                    //dataCallback && dataCallback(buffer); // Invoke the dataCallback if provided
                    buffers.push(buffer);
                });
                doc.on('end', () => {
                    resolve(Buffer.concat(buffers));
                    //endCallback && endCallback(); // Invoke the endCallback if provided
                });
                doc.end();  // Trigger the 'end' event
            });

            
    
            // Create a Nodemailer transporter
            // const transporter =  nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //         user: 'abhiramzmenon@gmail.com',
            //         pass: 'rsgwlnlrmsthvwqt'
            //     }
            // });

            const transporter = nodemailer.createTransport({
                // host: 'abhiramzmenon@gmail.com',
                service: 'gmail',
                port: 465,
                secure: true,
                auth: {
                     user: 'abhiramzmenon@gmail.com',
                     pass: 'rsgwlnlrmsthvwqt'
                }
            })

            const info = await transporter.sendMail({
                from: 'abhiramzmenon@gmail.com',
                to: email,
                subject: 'Testing node mailer',
                text: 'Please find the attached invoice.',
                attachments: [
                    {
                        filename: 'invoice.pdf',
                        content: pdfBuffer,
                        encoding: 'base64',
                    },
                ],
            })
    
            // Setup email data with unicode symbols
            // const mailOptions = {
            //     from: 'abhiramzmenon@gmail.com',
            //     to: email,
            //     subject: 'Testing node mailer',
            //     text: 'Please find the attached invoice.',
            //     attachments: [
            //         {
            //             filename: 'invoice.pdf',
            //             content: pdfBuffer,
            //             encoding: 'base64',
            //         },
            //     ],
            // };
    
            // Send mail with defined transport object
            // const info = await transporter.sendMail(mailOptions);
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
    throw new Error('Given phone number already exists in the database')
  } else {
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
            const { installments, examFees, registrationFees, totalAmount, admissionFees, admissionFeeDueDate, registrationFeeDueDate, examFeeDueDate } = niosFee
    
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
                        admissionFees,
                        admissionFeeDueDate,
                        registrationFees,
                        registrationFeeDueDate, 
                        examFees,
                        examFeeDueDate,
                        installments,
                    },
            }
            if (batch !== undefined && batch !== null && batch !== '') {
                studentQuery.batch = batch;
              }
    
            const niosStudent = await NiosStudent.create(studentQuery)
            // res.status(201).send(niosStudent)
            // if(niosStudent) {
            //     await buildPdf(name, course, studentQuery.batch && studentQuery.batch, phoneNumber, email, studentQuery.intake, studentQuery.feeDetails.admissionFees, studentQuery.feeDetails.examFees, studentQuery.feeDetails.examFeeDueDate, studentQuery.feeDetails.installments, studentQuery.feeDetails.registrationFees, studentQuery.feeDetails.registrationFeeDueDate)
            // }
            niosStudent.feeDetails.paidAmount = niosStudent.feeDetails.admissionFees
            niosStudent.feeDetails.admissionFeePaid = true
            
            res.status(201).send(niosStudent);
    
            if (niosStudent) {
                await buildPdf(
                    name,
                    course,
                    studentQuery.batch && studentQuery.batch,
                    phoneNumber,
                    email,
                    studentQuery.intake,
                    studentQuery.feeDetails.admissionFees,
                    studentQuery.feeDetails.examFees,
                    studentQuery.feeDetails.examFeeDueDate,
                    studentQuery.feeDetails.installments,
                    studentQuery.feeDetails.registrationFees,
                    studentQuery.feeDetails.registrationFeeDueDate
                );
            }
        }  else {
            throw new Error('NIOS fee doesnt found!')
        }    
    }

  // Fetch NiosFee based on the provided intake, course, batch, and year
  

        
        
        
    // } else {
    //     // res.status(404)
    //     throw new Error(`Nios fee doesnt found for the specific criteria`)
    // }

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
    } else if(feeType === 'admissionFees') {
        console.log('hey, iam part of admissionFees')
        console.log(feeType)
        if (student.feeDetails.admissionFeePaid) {
            throw new Error('Admission fee already paid by the student');
        } else {
            console.log('iam the else condition')
            student.feeDetails.admissionFeePaid = true;
            const admAmount = niosFee.admissionFees; // Get the registration fee amount from the fee schema
            student.feeDetails.paidAmount += admAmount
            createTransaction(student._id, admAmount, feeType); // Create a new transaction
        }
    } else {
        console.log('hey theree!!')
        const installmentToPay = student.feeDetails.installments.find(
            (installment) => installment.installmentNumber === installmentNumber
        );

        console.log(`printing the imnstallement details`, installmentToPay)

        installmentToPay.paidAmount = installmentToPay.paidAmount + amount
        let outstandingAmount = installmentToPay.amount - installmentToPay.paidAmount

        if (installmentToPay) {
            if (installmentToPay.isPaid === true) {
                throw new Error('Student already paid this installment');
            } else if(outstandingAmount < 0) {
                throw new Error('Entered amount exeeded. Please check the amount once more');
            } else {
                // if(installmentToPay.amount === amount) {
                //     installmentToPay.isPaid = true;
                // }
                console.log('outstanding amount', outstandingAmount)
                if(outstandingAmount === 0) {
                    installmentToPay.isPaid = true;
                }
                console.log('printing the paidAmount')
                console.log(installmentToPay.paidAmount)

                console.log(installmentToPay)
                  
                // installmentToPay.paidAmount += amount;
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
    buildPdf
};
