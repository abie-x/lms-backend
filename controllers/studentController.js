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
import { Types } from 'mongoose';

const { ObjectId } = Types;

async function buildPdf(
   name,
   course,
   batch,
   phoneNumber,
   email,
   intake,
   admissionFees,
   examFees,
   examFeeDueDate,
   admissionFeeDueDate,
   installments,
   registrationfees,
   registrationFeeDueDate,
   totalFee,
   paidFee,
   admissionNumber,
   mode
) {
   console.log(`printing the adm due ${registrationFeeDueDate}`);

   // const inputDateString = registrationFeeDueDate
   // const dateObject = new Date(inputDateString)
   // const day = dateObject.getUTCDate().toString().padStart(2, '0');
   // const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
   // const year = dateObject.getUTCFullYear();

   const getDates = (data) => {
      const dateObject = new Date(data);
      const day = dateObject.getUTCDate().toString().padStart(2, '0');
      const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
      const year = dateObject.getUTCFullYear();
      return `${day}-${month}-${year}`;
   };

   // console.log(day)
   // console.log(month)
   // console.log(year)

   try {
      const doc = new PDFDocument();

      doc.fontSize(12);
      doc.fillColor('blue');

      // doc.image('/workspace/controllers/test.png', 250, 0, {fit: [100, 100], align: 'center' })
      doc.text('Fee structure document', 70, 70, {
         align: 'center',
         bold: true,
      });

      // const logoPath = path.join(__dirname, '..', 'google-icon.svg');// Replace with the actual path to your logo image

      // const __filename = fileURLToPath(import.meta.url);
      // const __dirname = path.dirname(__filename);

      // Add 'INVOICE' in the top-right corner

      // Set the font size for the rest of the content
      doc.fontSize(12);

      //Add left-aligned text
      // doc.text('Invoice Date:  22-08-2022', 50, 130);
      doc.fillColor('blue').text('Billed By', 50, 130, { align: 'right' });
      doc.fillColor('black');
      doc.font('Helvetica');
      doc.text('Linfield Eduverse', 50, 150, { align: 'right', bold: true });
      doc.text('Edappal road, Kumaranellur', 50, 170, { align: 'right' });
      doc.text('kerala, 679534', 50, 190, { align: 'right' });
      doc.text('9567335361', 50, 210, { align: 'right' });

      doc.fillColor('blue').text('Billed to', 50, 130);
      doc.fillColor('black');
      doc.text(`${name} (${admissionNumber})`, 50, 150);
      doc.text(`${course} ${batch ? batch : ''} (${intake})`, 50, 170);
      doc.text(email, 50, 190);
      doc.text(phoneNumber, 50, 210);

      // doc.fontSize(12)
      // doc.text(`Hey ${name}!`, 40, 110)
      // doc.text(`A hearty welcome to the Linfield family! We' unfold, and we're committed to making it an experience filled with knowledge, growth, and memorable moments. As you set foot into the world of learning, we want to ensure that you have all the information you need regarding the fee structure for the upcoming academic session.`), 40, 150

      doc.strokeColor('blue');
      const lineY = doc.y + 20;
      doc.moveTo(50, lineY).lineTo(550, lineY).stroke();
      doc.strokeColor('black');

      const tableY = lineY + 30;
      doc.fontSize(12);
      doc.fillColor('blue');
      // doc.text('Fee Type', 50, tableY, { align: 'left' });
      // doc.text('Payment Type', 200, tableY, { align: 'left' });
      // doc.text('Amount', 350, tableY, { align: 'left' });
      // doc.text('Payment ID', 450, tableY, { align: 'left' });

      doc.text('Fee Type', 50, tableY);
      doc.text('Amount', 275, tableY);
      doc.text('Due date', 370, tableY);

      doc.fillColor('black');

      doc.text('Admission fees', 50, tableY + 20);
      doc.text(admissionFees, 280, tableY + 20);
      doc.text(admissionFeeDueDate, 370, tableY + 20);

      if (mode === 'Correspondent') {
         doc.text('Registration fees', 50, tableY + 40);
         doc.text(registrationfees, 280, tableY + 40);
         doc.text(registrationFeeDueDate, 370, tableY + 40);

         doc.text('Exam fees', 50, tableY + 60);
         doc.text(examFees, 280, tableY + 60);
         doc.text(examFeeDueDate, 370, tableY + 60);
      } else if (mode === 'Online') {
         doc.text('First Term fees', 50, tableY + 40);
         doc.text(installments[0].amount, 280, tableY + 40);
         doc.text(getDates(installments[0].dueDate), 370, tableY + 40);

         doc.text('Second Term fees', 50, tableY + 60);
         doc.text(installments[1].amount, 280, tableY + 60);
         doc.text(getDates(installments[1].dueDate), 370, tableY + 60);

         // doc.text('Third Term fees', 50, tableY + 80);
         // doc.text(installments[2].amount, 280, tableY + 80);
         // doc.text(getDates(installments[2].dueDate), 370, tableY + 80);

         doc.text('Registration fees', 50, tableY + 80);
         doc.text(registrationfees, 280, tableY + 80);
         doc.text(registrationFeeDueDate, 370, tableY + 80);

         doc.text('Exam fees', 50, tableY + 100);
         doc.text(examFees, 280, tableY + 100);
         // doc.text(getDates(examFeeDueDate), 475, tableY + 120)
         doc.text(examFeeDueDate, 370, tableY + 100);
      } else if (mode === 'Offline') {
         doc.text('First Term fees', 50, tableY + 40);
         doc.text(installments[0].amount, 280, tableY + 40);
         doc.text(getDates(installments[0].dueDate), 370, tableY + 40);

         doc.text('Second Term fees', 50, tableY + 60);
         doc.text(installments[1].amount, 280, tableY + 60);
         doc.text(getDates(installments[1].dueDate), 370, tableY + 60);

         doc.text('Registration fees', 50, tableY + 80);
         doc.text(registrationfees, 280, tableY + 80);
         doc.text(registrationFeeDueDate, 370, tableY + 80);

         doc.text('Exam fees', 50, tableY + 100);
         doc.text(examFees, 280, tableY + 100);
         // doc.text(getDates(examFeeDueDate), 475, tableY + 120)
         doc.text(examFeeDueDate, 370, tableY + 100);
      }

      doc.fontSize(12);
      // doc.text('Registration Fees', 50, tableY + 20, { align: 'left' });
      // doc.text('Online', 220, tableY + 20, { align: 'left' });
      // doc.text('2000', 360, tableY + 20, { align: 'left' });
      // doc.text('X789123', 450, tableY + 20, { align: 'left' });
      // doc.fillColor('blue').text('Course', 70, 220)
      // doc.text('NIOS Humanities', 70, 240)

      doc.strokeColor('gray');
      doc.moveTo(50, tableY + 160)
         .lineTo(550, tableY + 160)
         .stroke();
      doc.strokeColor('black');

      doc.fillColor('blue');

      //printing the total and balance
      doc.text('Total paid: ', 50, tableY + 180);
      doc.text('Balance to pay: ', 300, tableY + 180);

      doc.fillColor('black');

      doc.text(paidFee, 110, tableY + 180);
      doc.text(totalFee - paidFee, 390, tableY + 180);

      // Add notes section
      doc.text('Notes:', 50, tableY + 230, { underline: true });
      doc.text('- The amount paid is not refundable.', 50, tableY + 250);
      doc.text(
         '- Any payments received after the specified due dates will be subject to a late fee. ',
         50,
         tableY + 270
      );
      doc.text(
         `- The total amount mentioned above is exclusive of exam, registration and other custom fees.`,
         50,
         tableY + 290
      );
      doc.text(`- Invoice generated on ${new Date()}.`, 50, tableY + 320);

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
         doc.on('data', (buffer) => {
            //dataCallback && dataCallback(buffer); // Invoke the dataCallback if provided
            buffers.push(buffer);
         });
         doc.on('end', () => {
            resolve(Buffer.concat(buffers));
            //endCallback && endCallback(); // Invoke the endCallback if provided
         });
         doc.end(); // Trigger the 'end' event
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
            pass: 'sulzrxizaibnbzew',
         },
         // auth: {
         //    user: 'abhiramzmenon@gmail.com',
         //    pass: 'rsgwlnlrmsthvwqt',
         // },
         // auth: {
         //      user: 'abhiramzmenon@gmail.com',
         //      pass: 'rsgwlnlrmsthvwqt'
         // }
      });

      const info = await transporter.sendMail({
         from: 'hellolinfield@gmail.com',
         to: email,
         subject:
            'Congratulations! Your Enrollment Confirmation and Course Fee Information',
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
                    .message-points {
                      line-height: 0.5;
                    }
                    .Message-points-parent {
                      line-height: 0.7;
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
                      <p>അഡ്മിഷൻ എടുക്കുന്ന സമയത്ത് താഴെ പറയുന്ന വിവരങ്ങൾ പൂർണമായും ഉറപ്പുവരുത്തുക.</p>

                      <div class='message-points'>
                        <p>*ക്ലാസ് സമയം </p>
                        <p>*മൊത്തം ഫീസ്</p>
                        <p>*പഠിക്കേണ്ട വിഷയങ്ങൾ</p>
                      </div>

                      <br />

                      <div class="message-points-parent">
                        <p>→ അഡ്‌മിഷൻ എടുക്കുമ്പോൾ ഉപയോഗിക്കുന്ന ഫോൺ നമ്പർ & മെയിൽ ഐഡി മാറ്റുവാൻ പാടുകയില്ല.</p>
                        <p>→ അഡ്‌മിഷൻ എടുക്കുന്നത് parents / Guardian ഇവരുടെ പരിപൂർണ്ണ ഉത്തരവാദിത്ത്വത്തോടെ ആയിരിക്കണം.</p>
                        <p>→ അഡ്‌മിഷൻ എടുക്കുകയും പിന്നീട് പഠനം നിൽത്തുകയും ചെയ്യുന്ന പക്ഷം ഫീസിൻ്റെ 75% മുതൽ 100% വരെ അടച്ചാൽ മാത്രമേ അഡ്‌മിഷൻ ക്യാൻസൽ ലെറ്റർ, രജിസ്ട്രേഷൻ ഡീറ്റൈൽസ്, ഡോക്യുമെൻ്റ്സ് തിരിച്ചു നൽകുകയുള്ളൂ.</p>
                        <p>→ ക്ലാസിൽ അവധിയെടുക്കുന്നതിന് രക്ഷിതാവിൻ്റെയോ ഗാർഡിയൻ്റേയോ സമ്മതം അനിവാന്യമാണ്. മാത്രമല്ല, അക്കാദമിക് ഹെഡിനെ അവധി വിവരം അറിയിച്ചിരിക്കണം. ക്ലാസ് attend ചെയ്യേണ്ടത് നിങ്ങളുടെ ഉത്തരവാദിത്വമാണ്. റെഗുലറായി നിങ്ങൾക്കുള്ള ക്ലാസുകൾ ഞങ്ങൾ നൽകുന്നതാണ്.</p>
                        <p>→ സ്ഥാപനത്തിൽ അടച്ച തുക യാതൊരു കാരണവശാലും തിരിച്ച് നൽകുന്നതല്ല.</p>
                        <p>→ സ്ഥാപനത്തിൽ അടച്ച തുകയുടെ റസീപ്റ്റ് നിങ്ങളുടെ മെയിലിൽ വരുന്നതായിരിക്കും. ബാലൻസ് തുകയും അടക്കേണ്ട തിയ്യതിയും അതിൽ രേഖപ്പെടുത്തിയിരിക്കും. E-mailൽ വരുന്ന messages ശ്രദ്ധിക്കാതിരിക്കരുത്.</p>
                        <p>→ സ്ഥാപനത്തിൽ അടക്കുന്ന തുക payment App വഴി account transfer ചെയ്യുമ്പോൾ  Add noteൽ നിങ്ങളുടെ പേര്, കോഴ്‌സ്‌ എന്നിവ രേഖപ്പെടുത്തിയതോടൊപ്പം Screenshot എടുത്ത് അക്കാദമിക് ഹെഡിന് അയച്ച് കൊടുക്കുകയും ചെയ്യേണ്ടതാണ്. അല്ലാത്ത പക്ഷം payment തുക അസാധുവാകുന്നതായിരിക്കും.</p>
                        <p>→ അഡ്‌മിഷൻ എടുത്ത സമയത്ത് തന്നെ നിങ്ങളെ ഗ്രൂപ്പുകളിൽ Add ചെയ്യും. ഗ്രൂപ്പുകളിൽ നിന്ന് Data [Notes, Voice notes] പ്രധാനപ്പെട്ട സന്ദേശങ്ങൾ നഷ്‌ടപെടാതെ ശ്രദ്ധിക്കുകയും ചെയ്യുക.</p>
                        <p>→ അഡ്‌മിഷൻ എടുക്കുന്നത് ഏത് batchലേക്കാണോ ആ ബാച്ചിൽ ക്ലാസ് അറ്റൻഡ് ചെയ്യുകയും നിങ്ങളുടെ വ്യക്തിപരമായ കാരണങ്ങളാൽ പരീക്ഷ എഴുതാതിരിക്കുകയും ചെയ്‌താൽ ഈ ബാച്ചിൽ അടക്കേണ്ട tuition ഫീസിന് പുറമെ അടുത്ത ബാച്ചിൻ്റെ ക്ലാസിൽ ജോയിൻ ചെയ്യണമെങ്കിൽ പുതിയ ബാച്ചിന് tuition ഫീ മുഴുവനായും അടക്കേണ്ടി വരും.</p>

                        <br />
                        <p>സ്ഥാപനത്തിൻ്റെ നിയമങ്ങൾ പൂർണ്ണമായി- പാലിച്ചുകൊണ്ടും മുകളിൽ പറഞ്ഞ terms and conditions അംഗീകരിച്ചുകൊണ്ടും ഞാൻ പഠനം പൂർത്തിയാക്കുമെന്ന് ഉറപ്പ് നൽകുന്നു.</p>
                      </div>

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

const createNewTransaction = async (
   studentId,
   amount,
   type,
   purpose,
   name,
   admissionNumber,
   utrNumber
) => {
   try {
      const transaction = new Transaction({
         amount,
         type,
         purpose,
         date: new Date(),
         studentId,
         studentName: name,
         studentAdmissionNumber: admissionNumber,
         utrNumber,
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
      admissionFee, // New parameter: admissionFee
      utrNumber,
   } = req.body;

   // Check if a student with the same phone number exists
   const studentExist = await NiosStudent.findOne({ phoneNumber });

   if (studentExist) {
      throw new Error(
         'A student with the given phone number already exists in the database.'
      );
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
         const {
            installments,
            totalAmount,
            admissionFees,
            admissionFeeDueDate,
            examFeeDueDate,
            registrationFeeDueDate,
         } = niosFee;

         // Generate admission number (e.g., starting from 1001)
         const latestStudent = await NiosStudent.findOne(
            {},
            {},
            { sort: { createdAt: -1 } }
         );
         let admissionNumber = 1001; // Default admission number if no students exist yet
         if (latestStudent && latestStudent.admissionNumber) {
            admissionNumber = latestStudent.admissionNumber + 1;
         }

         console.log(admissionNumber);

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
               examFeeDueDate, //error is in this line of code
               registrationFeeDueDate,
               installments,
            },
         };

         if (batch !== undefined && batch !== null && batch !== '') {
            studentQuery.batch = batch;
         }

         if (studentQuery.feeDetails.admissionFees < parseInt(admissionFee)) {
            res.status(200);
            throw new Error('Entered admission fee exceeds the limit');
         } else {
            const niosStudent = await NiosStudent.create(studentQuery);

            // Update fee details
            if (
               niosStudent.feeDetails.admissionFees === parseInt(admissionFee)
            ) {
               niosStudent.feeDetails.admissionFeePaidAmount = admissionFee;
               niosStudent.feeDetails.admissionFeePaid = true;
               niosStudent.save();

               // Create a new transaction
               createNewTransaction(
                  niosStudent._id,
                  parseInt(admissionFee),
                  'credit',
                  'admissionFees',
                  niosStudent.name,
                  niosStudent.admissionNumber,
                  utrNumber
               );

               const getDates = (data) => {
                  const dateObject = new Date(data);
                  const day = dateObject
                     .getUTCDate()
                     .toString()
                     .padStart(2, '0');
                  const month = (dateObject.getUTCMonth() + 1)
                     .toString()
                     .padStart(2, '0'); // Month is zero-based
                  const year = dateObject.getUTCFullYear();
                  return `${day}-${month}-${year}`;
               };

               const examFeeDueDate = studentQuery.feeDetails.examFeeDueDate;
               const admissionFeeDueDate =
                  studentQuery.feeDetails.admissionFeeDueDate;
               const registrationFeeDueDate =
                  studentQuery.feeDetails.registrationFeeDueDate;

               const formattedExamFeeDueDate = getDates(examFeeDueDate);
               const formattedAdmissionFeeDueDate =
                  getDates(admissionFeeDueDate);
               const formattedRegistrationFeeDueDate = getDates(
                  registrationFeeDueDate
               );

               await buildPdf(
                  name,
                  course,
                  studentQuery.batch && studentQuery.batch,
                  phoneNumber,
                  email,
                  studentQuery.intake,
                  studentQuery.feeDetails.admissionFees,
                  (studentQuery.feeDetails.examFees = 'NA'),
                  formattedExamFeeDueDate,
                  'Paid',
                  studentQuery.feeDetails.installments,
                  'NA',
                  // formattedRegistrationFeeDueDate,
                  'NA',
                  studentQuery.feeDetails.totalAmount,
                  studentQuery.feeDetails.paidAmount,
                  studentQuery.admissionNumber,
                  studentQuery.mode
               );

               // Send response with the created student
               res.status(201).send(niosStudent);
            } else {
               // Update the admissionFeePaid amount
               niosStudent.feeDetails.admissionFeePaidAmount = admissionFee;
               niosStudent.save();

               // Create a new transaction
               createNewTransaction(
                  niosStudent._id,
                  parseInt(admissionFee),
                  'credit',
                  'admissionFees',
                  niosStudent.name,
                  niosStudent.admissionNumber,
                  utrNumber
               );

               const getDates = (data) => {
                  const dateObject = new Date(data);
                  const day = dateObject
                     .getUTCDate()
                     .toString()
                     .padStart(2, '0');
                  const month = (dateObject.getUTCMonth() + 1)
                     .toString()
                     .padStart(2, '0'); // Month is zero-based
                  const year = dateObject.getUTCFullYear();
                  return `${day}-${month}-${year}`;
               };

               const examFeeDueDate = studentQuery.feeDetails.examFeeDueDate;
               const admissionFeeDueDate =
                  studentQuery.feeDetails.admissionFeeDueDate;
               const registrationFeeDueDate =
                  studentQuery.feeDetails.registrationFeeDueDate;

               const formattedExamFeeDueDate = getDates(examFeeDueDate);
               const formattedAdmissionFeeDueDate =
                  getDates(admissionFeeDueDate);
               const formattedRegistrationFeeDueDate = getDates(
                  registrationFeeDueDate
               );

               //fixing the bugs with dates
               console.log(admissionFeeDueDate);
               console.log(formattedAdmissionFeeDueDate);

               await buildPdf(
                  name,
                  course,
                  studentQuery.batch && studentQuery.batch,
                  phoneNumber,
                  email,
                  studentQuery.intake,
                  studentQuery.feeDetails.admissionFees - admissionFee,
                  (studentQuery.feeDetails.examFees = 'NA'),
                  formattedExamFeeDueDate,
                  formattedAdmissionFeeDueDate,
                  studentQuery.feeDetails.installments,
                  // studentQuery.feeDetails.registrationFees = 'NA',
                  // studentQuery.feeDetails.registrationFeeDueDate ,
                  'NA', // Formatted date
                  // formattedRegistrationFeeDueDate,
                  'NA',
                  studentQuery.feeDetails.totalAmount,
                  studentQuery.feeDetails.paidAmount,
                  studentQuery.admissionNumber,
                  studentQuery.mode
               );

               console.log('hello');

               // Send response with the created student
               res.status(201).send(niosStudent);
            }
         }
      } else {
         throw new Error('NIOS fee not found for the provided criteria.');
      }
   }
});

async function feePaymentPdf(
   name,
   email,
   phoneNumber,
   course,
   batch,
   intake,
   admissionNumber,
   paymentMode = 'GPAY',
   transactionId,
   amount,
   feeName,
   mode
) {
   try {
      const doc = new PDFDocument();

      if (feeName === 'firstTerm') {
         feeName = 'First term fees';
      } else if (feeName === 'secondTerm') {
         feeName = 'Second term fees';
      }

      const getDates = (data) => {
         const dateObject = new Date(data);
         const day = dateObject.getUTCDate().toString().padStart(2, '0');
         const month = (dateObject.getUTCMonth() + 1)
            .toString()
            .padStart(2, '0'); // Month is zero-based
         const year = dateObject.getUTCFullYear();
         return `${day}-${month}-${year}`;
      };

      function numberToWords(num) {
         if (num === 0) return 'zero';

         const belowTwenty = [
            '',
            'one',
            'two',
            'three',
            'four',
            'five',
            'six',
            'seven',
            'eight',
            'nine',
            'ten',
            'eleven',
            'twelve',
            'thirteen',
            'fourteen',
            'fifteen',
            'sixteen',
            'seventeen',
            'eighteen',
            'nineteen',
         ];
         const tens = [
            '',
            '',
            'twenty',
            'thirty',
            'forty',
            'fifty',
            'sixty',
            'seventy',
            'eighty',
            'ninety',
         ];
         const thousands = ['', 'thousand', 'million', 'billion'];

         function helper(n) {
            if (n < 20) return belowTwenty[n];
            if (n < 100)
               return (
                  tens[Math.floor(n / 10)] +
                  (n % 10 !== 0 ? ' ' + belowTwenty[n % 10] : '')
               );
            if (n < 1000)
               return (
                  belowTwenty[Math.floor(n / 100)] +
                  ' hundred' +
                  (n % 100 !== 0 ? ' ' + helper(n % 100) : '')
               );
            for (
               let i = 1, unit = 1000;
               i < thousands.length;
               i++, unit *= 1000
            ) {
               if (n < unit * 1000) {
                  return (
                     helper(Math.floor(n / unit)) +
                     ' ' +
                     thousands[i] +
                     (n % unit !== 0 ? ' ' + helper(n % unit) : '')
                  );
               }
            }
         }

         return helper(num) + ' rupees only';
      }

      doc.fontSize(12);
      doc.fillColor('blue');

      // doc.image('/workspace/controllers/test.png', 250, 0, {fit: [100, 100], align: 'center' })
      doc.text('Fee payment receipt', 50, 70, { align: 'center', bold: true });

      // Set the font size for the rest of the content
      doc.fontSize(12);

      //Add left-aligned text
      // doc.text('Invoice Date:  22-08-2022', 50, 130);

      doc.font('Helvetica-Bold');
      doc.fillColor('black').text('Billed By', 50, 110, {
         align: 'right',
         bold: true,
      });
      doc.font('Helvetica');
      doc.fillColor('black');
      doc.text('Linfield Eduverse', 50, 130, { align: 'right' });
      doc.text('Edappal road, Kumaranellur', 50, 150, { align: 'right' });
      doc.text('kerala, 679534', 50, 170, { align: 'right' });
      doc.text('9567335361', 50, 190, { align: 'right' });

      doc.font('Helvetica-Bold');
      doc.fillColor('black').text('Billed to', 50, 110), { bold: true };
      doc.fillColor('black');
      doc.font('Helvetica');
      doc.text(`${name} (${admissionNumber})`, 50, 130);
      doc.text(`${course} ${batch ? batch : ''} (${intake}) ${mode}`, 50, 150);
      doc.text(email, 50, 170);
      doc.text(phoneNumber, 50, 190);

      doc.strokeColor('blue');
      const lineY = doc.y + 20;
      doc.moveTo(50, lineY).lineTo(550, lineY).stroke();
      doc.strokeColor('black');

      const tableY = lineY + 30;
      doc.fontSize(12);
      doc.fillColor('blue');

      doc.text('Payment details', 50, tableY);
      // doc.text('Amount', 275, tableY);
      // doc.text('Due date', 370, tableY);

      doc.fontSize(12);
      doc.fillColor('black');

      doc.font('Helvetica-Bold');
      doc.text(`Particular - `, 50, tableY + 32);

      doc.font('Helvetica');
      doc.text(`${feeName}`, 120, tableY + 32);

      doc.font('Helvetica-Bold');
      doc.text(`Transaction id - `, 220, tableY + 32);

      doc.font('Helvetica');
      doc.text(transactionId, 315, tableY + 32);

      doc.font('Helvetica-Bold');
      doc.text(`Date - `, 420, tableY + 32);

      doc.font('Helvetica');
      doc.text(getDates(new Date()), 460, tableY + 32);

      doc.font('Helvetica-Bold');
      doc.text(`Amount - `, 50, tableY + 62);

      doc.font('Helvetica');
      doc.text(amount, 105, tableY + 62);

      doc.font('Helvetica-Bold');
      doc.text(`Amount received in words - `, 150, tableY + 62);

      doc.font('Helvetica');
      doc.text(numberToWords(amount), 310, tableY + 62);

      doc.strokeColor('blue');
      const lineY2 = doc.y + 20;
      doc.moveTo(50, lineY2).lineTo(550, lineY2).stroke();
      doc.strokeColor('black');

      doc.text('Notes:', 50, tableY + 120, { underline: true });
      doc.text('- The amount paid is not refundable.', 50, tableY + 140);
      doc.text(
         '- Any payments received after the specified due dates will be subject to a late fee. ',
         50,
         tableY + 160
      );
      doc.text(`- Receipt generated on ${new Date()}.`, 50, tableY + 180);

      // Return a promise to handle asynchronous PDF generation
      const pdfBuffer = await new Promise((resolve) => {
         const buffers = [];
         doc.on('data', (buffer) => {
            //dataCallback && dataCallback(buffer); // Invoke the dataCallback if provided
            buffers.push(buffer);
         });
         doc.on('end', () => {
            resolve(Buffer.concat(buffers));
            //endCallback && endCallback(); // Invoke the endCallback if provided
         });
         doc.end(); // Trigger the 'end' event
      });

      const transporter = nodemailer.createTransport({
         // host: 'abhiramzmenon@gmail.com',
         service: 'gmail',
         port: 465,
         secure: true,
         auth: {
            user: 'hellolinfield@gmail.com',
            pass: 'sulzrxizaibnbzew',
         },
      });

      const info = await transporter.sendMail({
         from: 'hellolinfield@gmail.com',
         to: email,
         subject: `Fee payment receipt for ${feeName}`,
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
                    .message-points {
                      line-height: 0.5;
                    }
                    .Message-points-parent {
                      line-height: 0.7;
                    }
                    .signature {
                        font-style: italic;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                    </div>
                    <div class="message">
                      <p>Dear ${name},</p>
                      <p>We hope this email finds you well.</p>
                      <p>This is to confirm that we have successfully received your payment for the ${feeName}. Attached to this email, you will find your official payment receipt in PDF format.</p>

                      <p>Please review the attached receipt and keep it for your records. If you have any questions or require further assistance, feel free to reach out to our finance department at +91 8714272651.</p>

                    <div class="signature">
                      <p>Warm regards,</p>
                      <p>Nishad K.V<br>Founder, Linfield Eduverse</p>
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

//----------
const niosFeePay = asyncHandler(async (req, res) => {
   const { number, feeType, installmentNumber, amount, feeName, utrNumber } =
      req.body;

   console.log(number);
   console.log(feeType);
   console.log(installmentNumber);
   console.log(amount);
   console.log(`feeName: ${feeName}`);

   let tuitionFeeName;

   if (installmentNumber) {
      if (installmentNumber === 1) {
         tuitionFeeName = 'First term fees';
      } else if (installmentNumber === 2) {
         tuitionFeeName = 'Second term fees';
      } else if (installmentNumber === 3) {
         tuitionFeeName = 'Third term fees';
      }
   }

   // Find the student based on phoneNumber or email
   let student;

   student = await NiosStudent.findOne({
      $or: [{ admissionNumber: number }, { phoneNumber: number }],
   });

   if (!student) {
      throw new Error('Student not found');
   }

   // Check if the UTR number already exists in transactions
   const existingTransaction = await Transaction.findOne({ utrNumber });

   if (existingTransaction) {
      throw new Error('Transaction with this UTR number already exists');
   }

   if (feeName) {
      //do soemthing related to custom fee payment
      // Add custom fee to student record
      student.feeDetails.customFees.push({ feeName, amount });
      student.feeDetails.paidAmount += amount;
      createTransaction(
         student._id,
         amount,
         feeName,
         utrNumber,
         student.admissionNumber,
         student.name
      );
      await feePaymentPdf(
         student.name,
         student.email,
         student.phoneNumber,
         student.course,
         student.batch,
         student.intake,
         student.admissionNumber,
         'GPAY',
         utrNumber,
         amount,
         feeName,
         student.mode
      );
   } else {
      // Extract the student's details
      let { intake, course, batch, year, mode } = student;

      // Determine the appropriate fees based on student's details
      const feeQuery = {
         intake,
         course,
         year,
         mode,
      };

      if (course === 'SSLC') {
         batch = undefined;
      }

      if (batch !== undefined && batch !== null && batch !== '') {
         feeQuery.batch = batch;
      }

      console.log(feeQuery);

      const niosFee = await NiosFee.findOne(feeQuery);

      if (!niosFee) {
         throw new Error('Unable to fetch NIOS fee for this student');
      }

      if (feeType === 'examFees') {
         if (student.feeDetails.examFeePaid) {
            throw new Error('Exam fee already paid by the student');
         } else {
            if (amount > student.feeDetails.examFees) {
               throw new Error(
                  'Entered amount exceeds the examination amount. Please check the amount entered.'
               );
            } else if (amount < student.feeDetails.examFees) {
               throw new Error(
                  'Entered amount is less than the required amount. Please check and enter the correct amount.'
               );
            } else {
               student.feeDetails.examFeePaid = true;
               student.feeDetails.paidAmount += amount;
               createTransaction(
                  student._id,
                  amount,
                  feeType,
                  utrNumber,
                  student.admissionNumber,
                  student.name
               );
               await feePaymentPdf(
                  student.name,
                  student.email,
                  student.phoneNumber,
                  student.course,
                  student.batch,
                  student.intake,
                  student.admissionNumber,
                  'GPAY',
                  utrNumber,
                  amount,
                  'Exam fees',
                  student.mode
               );
            }
         }
      } else if (feeType === 'registrationFees') {
         if (student.feeDetails.registrationFeePaid) {
            throw new Error('Registration fee already paid by the student');
         } else {
            if (amount > student.feeDetails.registrationFees) {
               throw new Error(
                  'Entered amount exceeds the registration amount. Please check the amount entered.'
               );
            } else if (amount < student.feeDetails.registrationFees) {
               throw new Error(
                  'Entered amount is less than the required amount. Please check and enter the correct amount.'
               );
            } else {
               student.feeDetails.registrationFeePaid = true;
               student.feeDetails.paidAmount += amount;
               createTransaction(
                  student._id,
                  amount,
                  feeType,
                  utrNumber,
                  student.admissionNumber,
                  student.name
               );
               await feePaymentPdf(
                  student.name,
                  student.email,
                  student.phoneNumber,
                  student.course,
                  student.batch,
                  student.intake,
                  student.admissionNumber,
                  'GPAY',
                  utrNumber,
                  amount,
                  'Registration fees',
                  student.mode
               );
            }
         }
      } else if (feeType === 'admissionFees') {
         if (student.feeDetails.admissionFeePaid) {
            res.status(200);
            throw new Error('Admission fee already paid by the student');
         } else {
            let tempAmount = student.feeDetails.admissionFeePaidAmount + amount;
            if (tempAmount > student.feeDetails.admissionFees) {
               throw new Error('Entered amount exceeds the required amount');
            } else if (tempAmount === student.feeDetails.admissionFees) {
               student.feeDetails.admissionFeePaid = true;
               student.feeDetails.paidAmount += amount;
               student.feeDetails.admissionFeePaidAmount += amount;
               createTransaction(
                  student._id,
                  amount,
                  feeType,
                  utrNumber,
                  student.admissionNumber,
                  student.name
               );
               await feePaymentPdf(
                  student.name,
                  student.email,
                  student.phoneNumber,
                  student.course,
                  student.batch,
                  student.intake,
                  student.admissionNumber,
                  'GPAY',
                  utrNumber,
                  amount,
                  'Admission fees',
                  student.mode
               );
            } else {
               student.feeDetails.paidAmount += amount;
               student.feeDetails.admissionFeePaidAmount += amount;
               createTransaction(
                  student._id,
                  amount,
                  feeType,
                  utrNumber,
                  student.admissionNumber,
                  student.name
               );
               await feePaymentPdf(
                  student.name,
                  student.email,
                  student.phoneNumber,
                  student.course,
                  student.batch,
                  student.intake,
                  student.admissionNumber,
                  'GPAY',
                  utrNumber,
                  amount,
                  feeType,
                  student.mode
               );
            }
         }
      } else {
         const installmentToPay = student.feeDetails.installments.find(
            (installment) => installment.installmentNumber === installmentNumber
         );

         installmentToPay.paidAmount = installmentToPay.paidAmount + amount;
         let outstandingAmount =
            installmentToPay.amount - installmentToPay.paidAmount;

         console.log(`outstanding payment ${outstandingAmount}`);
         console.log(`installment to pay ${installmentToPay}`);

         if (installmentToPay) {
            if (installmentToPay.isPaid === true) {
               throw new Error('Student already paid this installment');
            } else if (outstandingAmount < 0) {
               throw new Error(
                  'Entered amount exeeded. Please check the amount once more'
               );
            } else {
               if (outstandingAmount === 0) {
                  installmentToPay.isPaid = true;
               }

               student.feeDetails.paidAmount += amount;
               createTransaction(
                  student._id,
                  amount,
                  tuitionFeeName,
                  utrNumber,
                  student.admissionNumber,
                  student.name
               ); // Create a new transaction
               await feePaymentPdf(
                  student.name,
                  student.email,
                  student.phoneNumber,
                  student.course,
                  student.batch,
                  student.intake,
                  student.admissionNumber,
                  'GPAY',
                  utrNumber,
                  amount,
                  feeType,
                  student.mode
               );
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
      status: 'success',
   });
});

// Helper function to create a new transaction
const createTransaction = async (
   studentId,
   amount,
   feeType,
   utrNumber,
   admissionNumber,
   studentName
) => {
   const newTransaction = new Transaction({
      amount,
      type: 'credit',
      purpose: feeType,
      studentId,
      date: new Date(),
      studentAdmissionNumber: admissionNumber,
      studentName,
      utrNumber,
   });

   await newTransaction.save();
};

//desc => get the details of a particular student
//route => /api/students/details?phoneNumber={phoneNumber}
//access => public
const getStudentDetails = asyncHandler(async (req, res) => {
   const { phoneNumber } = req.query;

   const student = await NiosStudent.findOne({ phoneNumber });

   console.log(`currently found student is: ${student}`);

   if (student) {
      res.status(200).send(student);
   } else {
      throw new Error(`Student doesn't exists for this Phone Number`);
   }
});

//desc => fetch student data by id
//route => /api/students/:id
//access => public
const fetchStudentDetailsById = asyncHandler(async (req, res) => {
   const { id } = req.params;

   console.log(id);

   const student = await NiosStudent.findById(id);

   if (student) {
      res.status(200).send(student);
   } else {
      throw new Error(`Student doesn't exist for the given id`);
   }
});

//update an existing student
//action plan: step1 => get the phonenumber from the student.
//step2 => get the stream, exam mode, enrollment number and year of last exam
//step3: add these details and modify the existing student details
//step4: if success, send the response back to the customer
const updateExistingStudent = asyncHandler(async (req, res) => {
   const admissionNumber = req.body.admissionNumber;
   const updatedFields = req.body;

   console.log(updatedFields);

   console.log(`updated fields are ${updatedFields}`);

   const student = await NiosStudent.findOneAndUpdate(
      { admissionNumber: admissionNumber },
      {
         $set: updatedFields,
      },
      { new: true } // To return the updated document
   );

   console.log(student);

   student.save();

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

   console.log(updatedFields);

   // Update the student document
   const student = await NiosStudent.findByIdAndUpdate(
      studentId,
      updatedFields,
      { new: true }
   );

   student.feeDetails.examFees = updatedFields.examFees;
   student.feeDetails.registrationFees = updatedFields.registrationFees;

   student.save();

   // console.log(student)

   if (student) {
      res.status(200).send(student);
   } else {
      res.status(400);
      throw new Error('Error updating the student record');
   }
});

// const modifyStudentData = asyncHandler (asyn (req, res) => {

// })

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
});

const getNumberOfAdmissions = async (req, res) => {
   try {
      const numberOfAdmissions = await NiosStudent.countDocuments();

      console.log(`printing the number of admissions, ${numberOfAdmissions}`);

      res.status(200).send({ numberOfAdmissions });
   } catch (error) {
      res.status(500).send({
         message: 'Error fetching number of admissions',
         error: error.message,
      });
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

const getAdmissionsCount = async (startDate, endDate) => {
   const admissions = await NiosStudent.find({
      createdAt: { $gte: startDate, $lte: endDate },
   }).exec();
   return admissions.length;
};

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

      res.json({
         dailyData: dailyAdmissions,
         weeklyData: weeklyAdmissions,
         monthlyData: monthlyAdmissions,
      });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
   }
});

const filterNiosStudents = async (req, res) => {
   try {
      // Receive filter object from the frontend
      const filter = req.body; // Assuming filter object is sent in the request body
      console.log(filter);

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
      if (filter.intake) {
         query.intake = filter.intake;
      }
      if (filter.pendingFee) {
         const feeQuery = {};

         // Check for specific fees
         if (filter.pendingFee === 'admissionFees') {
            query['feeDetails.admissionFeePaid'] = {
               $exists: true,
               $eq: false,
            };
         }
         if (filter.pendingFee === 'registrationFees') {
            query['feeDetails.registrationFeePaid'] = {
               $exists: true,
               $eq: false,
            };
         }
         if (filter.pendingFee === 'examFees') {
            query['feeDetails.examFeePaid'] = { $exists: true, $eq: false };
         }
         if (filter.pendingFee === 'firstTerm') {
            query['feeDetails.installments.0.isPaid'] = {
               $exists: true,
               $eq: false,
            };
         }
         if (filter.pendingFee === 'secondTerm') {
            query['feeDetails.installments.1.isPaid'] = {
               $exists: true,
               $eq: false,
            };
         }
         if (filter.pendingFee === 'thirdTerm') {
            query['feeDetails.installments.2.isPaid'] = {
               $exists: true,
               $eq: false,
            };
         }
         // Add other fee types as needed

         // Add fee query to the main query
         // query['feeDetails.installments'] = { $elemMatch: feeQuery };
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

const getStudentByNumber = async (req, res) => {
   try {
      // Extract the admission number or phone number from the query parameters
      const { number } = req.params;

      if (number.length === 10) {
         let student = await NiosStudent.findOne({
            phoneNumber: number,
         }).exec();
         if (student) {
            return res.json(student);
         } else {
            return res.status(404).json({ message: 'Student not found' });
         }
      } else if (number.length < 10) {
         let student = await NiosStudent.findOne({
            admissionNumber: number,
         }).exec();
         if (student) {
            return res.json(student);
         } else {
            return res.status(404).json({ message: 'Student not found' });
         }
      } else {
         return res.status(400).json({
            message: 'Invalid admission number or phone number provided',
         });
      }
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
   }
};

const getStudentTransactions = asyncHandler(async (req, res) => {
   try {
      const number = req.params.number;

      // Find the NIOS student record based on the admission number or mobile number
      const student = await NiosStudent.findOne({
         $or: [{ admissionNumber: number }, { phoneNumber: number }],
      });

      if (!student) {
         return res.status(404).json({ message: 'Student not found' });
      }

      // Get the student's _id
      const studentId = new ObjectId(student._id).toString();

      console.log(studentId);

      // Find transactions associated with the student
      const transactions = await Transaction.find({ studentId: studentId })
         .sort({ createdAt: -1 })
         .exec();

      res.json(transactions);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
   }
});

const getLatestAdmissionsCount = asyncHandler(async (req, res) => {
   try {
      const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000); // Calculate timestamp 48 hours ago

      console.log(`printing fourtyyears time stamp ${fortyEightHoursAgo}`);

      // Count SSLC admissions created in the past 48 hours
      const sslcCount = await NiosStudent.countDocuments({
         createdAt: { $gte: fortyEightHoursAgo },
         course: 'SSLC',
      });

      // Count Plus2 admissions created in the past 48 hours
      const plus2Count = await NiosStudent.countDocuments({
         createdAt: { $gte: fortyEightHoursAgo },
         course: 'Plustwo',
      });

      // Send the counts as JSON response
      res.json({ sslcCount, plus2Count });
   } catch (error) {
      console.error('Error fetching admissions count:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

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
   filterNiosStudents,
   getStudentByNumber,
   getStudentTransactions,
   getLatestAdmissionsCount,
};
