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


async function buildPdf(name, course, batch, phoneNumber, email, intake, admissionFees, examFees, examFeeDueDate, installments, registrationfees, registrationFeeDueDate, totalFee, paidFee) {
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
            doc.text(examFeeDueDate, 475, tableY + 100)
    
            doc.text('Exam fees', 50, tableY + 120)
            doc.text(examFees, 280, tableY + 120)   
            // doc.text(getDates(examFeeDueDate), 475, tableY + 120)
            doc.text(examFeeDueDate, 475, tableY + 120)
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
            
            doc.text(paidFee, 110, tableY + 180)
            doc.text(totalFee - paidFee, 390, tableY + 180)
    
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
                    user: 'hellolinfield@gmail.com',
                    pass: 'vtubtgatbgjltgqe'
               }
                // auth: {
                //      user: 'abhiramzmenon@gmail.com',
                //      pass: 'rsgwlnlrmsthvwqt'
                // }
            })

            const info = await transporter.sendMail({
                from: 'hellolinfield@gmail.com',
                to: email,
                subject: 'Congratulations! Your Enrollment Confirmation and Course Fee Information',
                html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Welcome to Linfield!</title>
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                      line-height: 1.6;
                      margin: 0;
                      padding: 0;
                    }
                    .container {
                      max-width: 600px;
                      margin: auto;
                      padding: 20px;
                    }
                    .header {
                      text-align: center;
                      margin-bottom: 20px;
                    }
                    .header h1 {
                      font-size: 24px;
                      color: #007bff;
                    }
                    .message {
                      font-size: 16px;
                      margin-bottom: 20px;
                    }
                    .signature {
                        font-style: italic;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>Welcome to Linfield Eduverse👨‍🎓</h1>
                    </div>
                    <div class="message">
                      <p>Dear ${name},</p>
                      <p>Welcome to Linfield! I'm Nishad, the founder at Linfield, and I'm thrilled to have you join our community. At Linfield, we're dedicated to creating a supportive and engaging learning environment where every student can thrive.</p>
                      <p>As you start on this journey with us, know that you have a team of teachers, staff, and fellow students here to support you along the way.</p>
                      <p>While starting something new may feel daunting, remember that it's also an exciting opportunity for growth and discovery.</p>
                      <p>Be curious, be kind, and be courageous. Embrace challenges as opportunities to learn and grow, and don't hesitate to seek help when you need it.</p>
                      <p>I'm eager to see the incredible things you'll accomplish during your time at Linfield.</p>
                      <p>Welcome aboard, and let's make your educational journey at Linfield truly remarkable!</p>
                      <p>Attached below is the fee payment schedule for your reference.</p>
                    </div>
                    <div class="signature">
                      <p>Warm regards,</p>
                      <p>Nishad<br>Founder, Linfield Eduverse</p>
                    </div>
                  </div>
                </body>
                </html>`,
                attachments: [
                    {
                        filename: 'invoice.pdf',
                        content: pdfBuffer,
                        encoding: 'base64',
                    },
                ], 
            });
            
            
            
            
            
    
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

const createNewTransaction = async (studentId, amount, type, purpose, name, admissionNumber) => {

    console.log(`Printing the values assosiated with transactions..`)
    console.log(studentId)
    console.log(amount)
    console.log(type)
    console.log(purpose)
    console.log(name)
    console.log(admissionNumber)

    try {
        const transaction = new Transaction({
            amount,
            type,
            purpose,
            date: new Date(),
            studentId,
            studentName: name,
            studentAdmissionNumber: admissionNumber
        });

        await transaction.save();
    } catch (error) {
        throw new Error(`Error creating transaction: ${error.message}`);
    }
};



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
        admissionCoordinator,
        admissionFee // New parameter: admissionFee
    } = req.body;

    

    // Check if a student with the same phone number exists
    const studentExist = await NiosStudent.findOne({ phoneNumber });

    if (studentExist) {
        throw new Error('A student with the given phone number already exists in the database.');
    } else {
        const query = {
            intake,
            course,
            year,
            mode,
        };

        if (batch !== undefined && batch !== null && batch !== '') {
            query.batch = batch;
        }

        const niosFee = await NiosFee.findOne(query);

        if (niosFee) {
            const { installments, totalAmount, admissionFees, admissionFeeDueDate } = niosFee;

            // Generate admission number (e.g., starting from 1001)
            const latestStudent = await NiosStudent.findOne({}, {}, { sort: { 'createdAt': -1 } });
            let admissionNumber = 1001; // Default admission number if no students exist yet
            if (latestStudent && latestStudent.admissionNumber) {
                admissionNumber = latestStudent.admissionNumber + 1;
            }

            console.log(admissionNumber)

            const studentQuery = {
                admissionNumber,
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
                    paidAmount: admissionFee,
                    admissionFees,
                    admissionFeeDueDate,
                    installments,
                },  
            };

            if (batch !== undefined && batch !== null && batch !== '') {
                studentQuery.batch = batch;
            }

            if (studentQuery.feeDetails.admissionFees < parseInt(admissionFee)) {
                res.status(200)
                throw new Error('Entered admission fee exceeds the limit')
            } else {
                const niosStudent = await NiosStudent.create(studentQuery);

                // Update fee details 
                if (niosStudent.feeDetails.admissionFees === parseInt(admissionFee)) {
                    niosStudent.feeDetails.admissionFeePaidAmount = admissionFee
                    niosStudent.feeDetails.admissionFeePaid = true;
                    niosStudent.save()

                    // Create a new transaction
                    createNewTransaction(niosStudent._id, parseInt(admissionFee), 'credit', 'admissionFees', niosStudent.name, niosStudent.admissionNumber  );

                    console.log('hi')

                    // Send response with the created student
                    res.status(201).send(niosStudent);
                } else {
                    // Update the admissionFeePaid amount
                    niosStudent.feeDetails.admissionFeePaidAmount = admissionFee
                    niosStudent.save()

                    // Create a new transaction
                    createNewTransaction(niosStudent._id, parseInt(admissionFee), 'credit', 'admissionFees', niosStudent.name, niosStudent.admissionNumber   );

                    console.log('hello')

                    // Send response with the created student
                    res.status(201).send(niosStudent);
                }
            }
        } else {
            throw new Error('NIOS fee not found for the provided criteria.');
        }
    }
});



// desc  => create a new NIOS student
//route => /api/students/nios
//access => public
// const createNiosStudent = asyncHandler(async (req, res) => {

//   const {
//     name,
//     place,
//     year,
//     course,
//     batch,
//     intake,
//     mode,
//     phoneNumber,
//     parentNumber,
//     dob,
//     email,
//     branch,
//     admissionCoordinator
//   } = req.body;

//   console.log('heyy')


//   //check if a student with the same email id exists
//   const studentExist = await NiosStudent.findOne({phoneNumber})

//   if(studentExist) {
//     throw new Error('Given phone number already exists in the database')
//   } else {
//     const query = {
//         intake,
//         course,
//         year,
//         mode,
//       };
    
//       console.log(batch)
    
//       if (batch !== undefined && batch !== null && batch !== '') {
//         query.batch = batch;
//       }
    
//       console.log(query)
    
//         const niosFee = await NiosFee.findOne(query);
    
//         console.log(niosFee)
    
//         if(niosFee) {
//             //changed exam fee and reg fee , examfee due date and reg fee due date from this
//             const { installments, totalAmount, admissionFees, admissionFeeDueDate, } = niosFee
    
//             const studentQuery = {
//                     name,
//                     place,
//                     year,
//                     course,
//                     intake,
//                     mode,
//                     phoneNumber,
//                     parentNumber,
//                     dob,
//                     email,
//                     branch,
//                     admissionCoordinator,
//                     feeDetails: {
//                         totalAmount,
//                         paidAmount: admissionFees,
//                         admissionFees,
//                         admissionFeePaid: true,
//                         admissionFeeDueDate,
//                         // registrationFees,
//                         // registrationFeeDueDate, 
//                         // examFees,
//                         // examFeeDueDate,
//                         installments,
//                     },

//                     //modified examfeed and examfee due date from here
//             }
//             if (batch !== undefined && batch !== null && batch !== '') {
//                 studentQuery.batch = batch;
//               }
    
//             const niosStudent = await NiosStudent.create(studentQuery)
//             // res.status(201).send(niosStudent)
//             // if(niosStudent) {
//             //     await buildPdf(name, course, studentQuery.batch && studentQuery.batch, phoneNumber, email, studentQuery.intake, studentQuery.feeDetails.admissionFees, studentQuery.feeDetails.examFees, studentQuery.feeDetails.examFeeDueDate, studentQuery.feeDetails.installments, studentQuery.feeDetails.registrationFees, studentQuery.feeDetails.registrationFeeDueDate)
//             // }
//             niosStudent.feeDetails.paidAmount = niosStudent.feeDetails.admissionFees
//             niosStudent.feeDetails.admissionFeePaid = true
            
//             //create a new transaction
//             createTransaction(niosStudent._id, niosStudent.feeDetails.admissionFees, 'admissionFees');

//             res.status(201).send(niosStudent);
    
//             if (niosStudent) {
//                 await buildPdf(
//                     name,
//                     course,
//                     studentQuery.batch && studentQuery.batch,
//                     phoneNumber,
//                     email,
//                     studentQuery.intake,
//                     studentQuery.feeDetails.admissionFees, 
//                     studentQuery.feeDetails.examFees = 'NA',
//                     // studentQuery.feeDetails.examFeeDueDate = 'depends', 
//                     'NA',
//                     studentQuery.feeDetails.installments,
//                     // studentQuery.feeDetails.registrationFees = 'NA',
//                     // studentQuery.feeDetails.registrationFeeDueDate ,
//                     'NA',
//                     'NA',
//                     studentQuery.feeDetails.totalAmount,
//                     studentQuery.feeDetails.paidAmount
//                 );
//             }

//         }  else {
//             throw new Error('NIOS fee doesnt found!')
//         }    
//     }

//   // Fetch NiosFee based on the provided intake, course, batch, and year
  

        
        
        
//     // } else {
//     //     // res.status(404)
//     //     throw new Error(`Nios fee doesnt found for the specific criteria`)
//     // }

// })

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
    const { phoneNumber, feeType, installmentNumber, amount, feeName } = req.body;

    console.log(phoneNumber)
    console.log(feeType)
    console.log(installmentNumber)
    console.log(amount)
    console.log(`feeName: ${feeName}`)

    // Find the student based on phoneNumber or email
    let student;

    if (phoneNumber) {
        student = await NiosStudent.findOne({ phoneNumber });
    }

    if (!student) {
        throw new Error('Student not found');
    }

    if(feeName) {
        //do soemthing related to custom fee payment
        // Add custom fee to student record
        student.feeDetails.customFees.push({ feeName, amount });
    } else {
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

        } else if (feeType === 'registrationFees') {

            console.log('hey, iam part of registrationfee')
            
        } else if(feeType === 'admissionFees') {
            console.log('hey, iam part of admissionFees')
            console.log(feeType)
            if (student.feeDetails.admissionFeePaid) {
                res.status(200)
                throw new Error('Admission fee already paid by the student');
            } else {
                let tempAmount = student.feeDetails.admissionFeePaidAmount + amount
                console.log(tempAmount)
                if(tempAmount > student.feeDetails.admissionFees) {
                    throw new Error('Entered amount exceeds the required amount')
                } else if(tempAmount === student.feeDetails.admissionFees) {
                    console.log('iam executing the good condition')
                    student.feeDetails.admissionFeePaid = true;
                    student.feeDetails.paidAmount += amount
                    student.feeDetails.admissionFeePaidAmount += amount
                    createTransaction(student._id, amount, feeType)
                } else {
                    student.feeDetails.paidAmount += amount
                    student.feeDetails.admissionFeePaidAmount += amount
                    createTransaction(student._id, amount, feeType)
                }
                
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

    console.log(`currently found student is: ${student}`)

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

    console.log(`updated fields are ${updatedFields}`)

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
    const studentId = req.params.id;
    const updatedFields = req.body;

    console.log(updatedFields)

    // Update the student document
    const student = await NiosStudent.findByIdAndUpdate(
        studentId,
        updatedFields,
        { new: true }
    );

    student.feeDetails.examFees = updatedFields.examFees
    student.feeDetails.registrationFees = updatedFields.registrationFees

    student.save()

    // console.log(student)

    if (student) {
        res.status(200).send(student);
    } else {
        res.status(400);
        throw new Error('Error updating the student record');
    }
});

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


const getNumberOfAdmissions = async (req, res) => {
    try {
        const numberOfAdmissions = await NiosStudent.countDocuments();

        console.log(`printing the number of admissions, ${numberOfAdmissions}`)

        res.status(200).send({ numberOfAdmissions });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching number of admissions', error: error.message });
    }
};

const getRecentAdmissions = asyncHandler(async (req, res) => {
    try {
        const recentAdmissions = await NiosStudent.find({})
            .sort({ createdAt: -1 })
            .limit(25);

        res.status(200).send(recentAdmissions);
    } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
    }
});

const getAdmissionsCount =  (async (startDate, endDate) => {
    const admissions = await NiosStudent.find({ createdAt: { $gte: startDate, $lte: endDate } }).exec();
    return admissions.length
})

//using in the insights page in frontend
const getAdmissionsInfo = asyncHandler(async (req, res) => {
    try {
        const currentDate = new Date();
        const startDate = new Date(currentDate);
        const endDate = new Date(currentDate);
        
        // Get daily data
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        const dailyAdmissions = await getAdmissionsCount(startDate, endDate);

        // Get weekly data
        startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of the week (Sunday)
        endDate.setDate(endDate.getDate() - endDate.getDay() + 6); // End of the week (Saturday)
        endDate.setHours(23, 59, 59, 999);
        const weeklyAdmissions = await getAdmissionsCount(startDate, endDate);

        // Get monthly data
        startDate.setDate(1); // Start of the month
        endDate.setMonth(endDate.getMonth() + 1); // Start of next month
        endDate.setDate(0); // Last day of the current month
        const monthlyAdmissions = await getAdmissionsCount(startDate, endDate);

        res.json({ dailyData: dailyAdmissions, weeklyData: weeklyAdmissions, monthlyData: monthlyAdmissions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const filterNiosStudents = async (req, res) => {
    try {
        // Receive filter object from the frontend
        const filter = req.body; // Assuming filter object is sent in the request body

        // Build the query object based on the provided filter
        const query = {};

        if (filter.year) {
            query.year = filter.year;
        }
        if (filter.course) {
            query.course = filter.course;
        }
        if (filter.mode) {
            query.mode = filter.mode;
        }
        if (filter.pendingFee) {
            query['feeDetails.totalAmount'] = { $gt: 0 }; // Assuming pending fee means totalAmount is greater than 0
        }
        if (filter.registrationStatus) {
            query.registrationStatus = filter.registrationStatus;
        }
        if (filter.academicStatus) {
            query.academicStatus = filter.academicStatus;
        }
        if (filter.examMonth) {
            query.examMonth = filter.examMonth;
        }
        if (filter.examCentre) {
            query.examCentre = filter.examCentre;
        }
        if (filter.tmaReceived !== undefined) {
            query.tmaReceived = filter.tmaReceived;
        }
        if (filter.tmaSubmitted !== undefined) {
            query.tmaSubmitted = filter.tmaSubmitted;
        }
        if (filter.toc !== undefined) {
            query.toc = filter.toc;
        }
        if (filter.tocReceived !== undefined) {
            query.tocReceived = filter.tocReceived;
        }
        if (filter.tocSubmitted !== undefined) {
            query.tocSubmitted = filter.tocSubmitted;
        }
        // Add other filter criteria as needed

        // Query the NIOS students collection based on the filter criteria
        const filteredStudents = await NiosStudent.find(query).exec();

        // Return the filtered results to the frontend
        res.json(filteredStudents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};






export { 
    createNiosStudent,
    niosFeePay,
    getStudentDetails,
    fetchStudentDetailsById,
    updateStudent,
    getStudentsWithUnpaidFees,
    getStudentsCreatedToday,
    updateExistingStudent,
    buildPdf,
    getNumberOfAdmissions,
    getRecentAdmissions,
    getAdmissionsInfo,
    filterNiosStudents
};
