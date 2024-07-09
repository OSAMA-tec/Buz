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

    const emailSubject = 'Verificación de OTP';
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
          .logo {
            display: block;
            margin: 0 auto;
            max-width: 200px;
            height: auto;
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
          <img src="../../pics/buslogo-removebg-preview.png" alt="Logo" class="logo" />
          <h1>Verificación de OTP</h1>
          <p>Estimado ${newUser.name},</p>
          <p>Por favor, utilice el siguiente OTP para verificar su cuenta:</p>
          <p class="otp">${otp}</p>
          <p>Saludos cordiales,<br>El Equipo de Ahi voy & Ahi viene</p>
        </div>
      </body>
    </html>
  `;
  

    await sendEmail({ to: email, subject: emailSubject, html: emailHtml });

    res.status(201).json({ message: 'Usuario creado con éxito. Por favor, verifica tu cuenta usando el OTP enviado a tu correo electrónico.' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
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
      return res.status(401).json({ error: 'OTP no verificado.' });
    }

    if (user.otpPurpose === 'forgotPassword') {
      user.otpVerified = true;
      user.otp = null;
      user.otpPurpose = 'signup';
      await user.save();
    }
    const isValid = isPasswordValid(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
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

    res.status(200).json({ message: 'Inicio de sesión exitoso.', token,role:user.role });
  } catch (error) {
    console.error('Error during signin:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
module.exports = { signup, signin };