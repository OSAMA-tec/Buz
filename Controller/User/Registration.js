const { User } = require('../../Model/User');
const { generatePasswordHash, isPasswordValid } = require('../../Utils/password');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../Notification-Worker/sendEmail');

const signup = async (req, res) => {
  try {
    const { name, email, password, phoneNo, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.otpVerified && existingUser.otpPurpose === 'signup') {
        await User.deleteOne({ _id: existingUser._id });
      } else {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    const hashedPassword = generatePasswordHash(password);
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNo,
      role,
      otp,
      otpVerified: false,
      otpPurpose: 'signup',
    });

    await newUser.save();

    const emailSubject = 'OTP Verification';
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
            <h1>OTP Verification</h1>
            <p>Dear ${newUser.name},</p>
            <p>Please use the following OTP to verify your account:</p>
            <p class="otp">${otp}</p>
            <p>Best regards,<br>The Bus App Team</p>
          </div>
        </body>
      </html>
    `;
    await sendEmail({ to: email, subject: emailSubject, html: emailHtml });

    res.status(201).json({ message: 'User created successfully. Please verify your account using the OTP sent to your email.' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.otpVerified && user.otpPurpose === 'signup') {
      await User.deleteOne({ _id: user._id });
      return res.status(401).json({ error: 'OTP not verified. Account deleted.' });
    }

    if (user.otpPurpose === 'forgotPassword') {
      user.otpVerified = true;
      user.otp = null;
      user.otpPurpose = 'signup';
      await user.save();
    }
    const isValid = isPasswordValid(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    let token;
    const payload = { _id: user._id, email: user.email, role: user.role };
    const options = { expiresIn: '30d' };

    if (user.role === 'admin') {
      token = jwt.sign(payload, process.env.secretAdmin, options);
    } else if (user.role === 'driver') {
      token = jwt.sign(payload, process.env.secretDriver, options);
    } else if (user.role === 'owner') {
      token = jwt.sign(payload, process.env.secretOwner, options);
    } else {
      token = jwt.sign(payload, process.env.secretUser, options);
    }

    res.status(200).json({ message: 'Signin successful', token,role:user.role });
  } catch (error) {
    console.error('Error during signin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = { signup, signin };