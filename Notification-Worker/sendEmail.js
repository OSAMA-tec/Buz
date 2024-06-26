// notification-worker/sendEmail.js
const nodemailer = require('nodemailer');
const BrevoDatTransport = require('nodemailer-brevo-transport');
require('dotenv').config();

const transporter = nodemailer.createTransport(new BrevoDatTransport({
  apiKey: process.env.SENDINBLUE_API_KEY,
}));

async function sendEmail({ to, subject, html }) {
  const mailOptions = {
    from: '"Bus App" <no-reply@busapp.com>',
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}`, error);
  }
}

module.exports = sendEmail;