// userController.js
const { User } = require('../../Model/User');
const { generatePasswordHash, isPasswordValid } = require('../../Utils/password');
const sendEmail = require('../../Notification-Worker/sendEmail');

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;
    user.otpVerified = false;
    user.otpPurpose = 'forgotPassword';
    await user.save();
    const emailSubject = 'OTP para Restablecer Contraseña';
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
          <h1>OTP para Restablecer Contraseña</h1>
          <p>Estimado ${user.name},</p>
          <p>Ha solicitado restablecer su contraseña. Por favor, use el siguiente OTP para verificar su identidad:</p>
          <p class="otp">${otp}</p>
          <p>Si no solicitó un restablecimiento de contraseña, por favor ignore este correo electrónico.</p>
          <p>Saludos cordiales,<br>El Equipo de Ahi voy & Ahi viene</p>
        </div>
      </body>
    </html>
  `;
  

    await sendEmail({ to: email, subject: emailSubject, html: emailHtml });

    res.status(200).json({ message: 'OTP enviado con éxito.' });
  } catch (error) {
    console.error('Error during forgot password:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// otpVerificationController.js
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Se requieren el correo electrónico y el OTP. '});
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    if (!user.otp) {
      return res.status(400).json({ error: 'No se encontró OTP para el usuario.' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: 'OTP inválido.' });
    }

    user.otpVerified = true;
    user.otp = null;
    await user.save();

    res.status(200).json({ message: 'OTP verificado con éxito.' });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// updatePasswordController.js

const updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    if (!user.otpVerified) {
      return res.status(400).json({ error: 'OTP no verificado' });
    }

    const hashedPassword = generatePasswordHash(password);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
  } catch (error) {
    console.error('Error during password update:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { forgotPassword,updatePassword ,verifyOTP};