// userController.js
const { User } = require('../../Model/User');
const { generatePasswordHash, isPasswordValid } = require('../../Utils/password');
const sendEmail = require('../../Notification-Worker/sendEmail');

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpVerified = false;
    await user.save();

    const emailSubject = 'Password Reset OTP';
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333333;
            }
            p {
              color: #666666;
            }
            .otp {
              font-size: 24px;
              font-weight: bold;
              color: #007bff;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Password Reset OTP</h1>
            <p>Dear ${user.name},</p>
            <p>You have requested to reset your password. Please use the following OTP to verify your identity:</p>
            <p class="otp">${otp}</p>
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>Best regards,<br>The Bus App Team</p>
          </div>
        </body>
      </html>
    `;
    await sendEmail({ to: email, subject: emailSubject, html: emailHtml });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error during forgot password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// otpVerificationController.js
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    user.otpVerified = true;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// updatePasswordController.js

const updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.otpVerified) {
      return res.status(400).json({ error: 'OTP not verified' });
    }

    const hashedPassword = generatePasswordHash(password);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error during password update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { forgotPassword,updatePassword ,verifyOTP};