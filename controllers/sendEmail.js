import { buildPdf } from "./studentController";

const sendEmail = async ({ name, course, batch, phoneNumber, email }) => {
    try {
      await buildPdf(name, course, batch, phoneNumber, email);
      // Additional logic for sending the email if needed
      console.log('Email sent successfully.');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  
module.exports = sendEmail