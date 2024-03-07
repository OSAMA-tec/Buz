// notification-worker/sendEmail.js
const nodemailer = require('nodemailer');
const SendinBlueTransport = require('nodemailer-sendinblue-transport');

const transporter = nodemailer.createTransport(new SendinBlueTransport({
  apiKey: process.env.SENDINBLUE_API_KEY,
}));
async function sendEmail({ to, subject,html }) {
  const mailOptions = {
    from: '"Motive App" <no-reply@motiveapp.com>',
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