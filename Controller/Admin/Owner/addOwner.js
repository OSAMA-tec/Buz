const { User } = require('../../../Model/User');
const { OwnerBus } = require('../../../Model/Owner');
const bcrypt = require('bcrypt');
const sendEmail = require('../../../Notification-Worker/sendEmail');

const addOwner = async (req, res) => {
    try {
        const {
            name,
            email,
            phoneNo,
            contactDetails,
            companyName,
            companyLocation,
            numberOfBuses,
            contactPerson,
            registrationNumber,
            establishedYear
        } = req.body;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You are not authorized to add bus owners' });
        }

        if (!name) {
            return res.status(400).json({ error: 'Se requiere el nombre' });
        }

        if (!email) {
            return res.status(400).json({ error: 'Se requiere el correo electrónico' });
        }

        if (!phoneNo) {
            return res.status(400).json({ error: 'Se requiere el número de teléfono' });
        }

        if (!contactDetails) {
            return res.status(400).json({ error: 'Se requieren los detalles de contacto' });
        }

        if (!companyName) {
            return res.status(400).json({ error: 'Se requiere el nombre de la empresa' });
        }

        if (!companyLocation) {
            return res.status(400).json({ error: 'Se requiere la ubicación de la empresa' });
        }

        if (!numberOfBuses) {
            return res.status(400).json({ error: 'Se requiere el número de autobuses' });
        }

        if (!contactPerson) {
            return res.status(400).json({ error: 'Se requiere la persona de contacto' });
        }

        if (!registrationNumber) {
            return res.status(400).json({ error: 'Se requiere el número de registro' });
        }

        if (!establishedYear) {
            return res.status(400).json({ error: 'Se requiere el año de establecimiento' });
        }
        const existingOwner = await User.findOne({ email });
        if (existingOwner) {
            return res.status(400).json({ error: 'Bus owner already exists' });
        }

        const password = Math.random().toString(36).slice(-8);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newOwner = new User({
            name,
            email,
            password: hashedPassword,
            phoneNo,
            role: 'owner',
            contactDetails
        });

        const savedOwner = await newOwner.save();
        if (!savedOwner) {
            return res.status(500).json({ error: 'Failed to save bus owner' });
        }

        const newOwnerBus = new OwnerBus({
            userId: savedOwner._id,
            companyName,
            companyLocation,
            numberOfBuses,
            contactPerson,
            registrationNumber,
            establishedYear
        });

        const savedOwnerBus = await newOwnerBus.save();
        if (!savedOwnerBus) {
            return res.status(500).json({ error: 'Failed to save owner bus details' });
        }

        const emailSubject = 'Cuenta de Propietario de Autobús Creada';
        const emailBody = `
          <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #cccccc; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="../../../pics/buslogo-removebg-preview.png" alt="Logo de Bus App" style="max-width: 200px;">
            </div>
            
            <p>Estimado ${name},</p>
            
            <p>¡Felicitaciones! Su cuenta de propietario de autobús ha sido creada exitosamente. Por favor, utilice las siguientes credenciales para iniciar sesión:</p>
            
            <table style="width: 100%; margin-bottom: 20px;">
              <tr>
                <td style="padding: 10px; background-color: #f2f2f2; border: 1px solid #cccccc; font-weight: bold;">Correo electrónico:</td>
                <td style="padding: 10px; border: 1px solid #cccccc;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; background-color: #f2f2f2; border: 1px solid #cccccc; font-weight: bold;">Contraseña:</td>
                <td style="padding: 10px; border: 1px solid #cccccc;">${password}</td>
              </tr>
            </table>
            
            <p style="color: #ff0000; font-weight: bold;">Importante: Por favor, cambie su contraseña después de iniciar sesión por primera vez para garantizar la seguridad de su cuenta.</p>
            
            <p>Si tiene alguna pregunta o necesita asistencia, no dude en ponerse en contacto con nuestro equipo de soporte en <a href="mailto:support@busapp.com" style="color: #007bff; text-decoration: none;">support@busapp.com</a>.</p>
            
            <p>Gracias por elegir Bus App. Esperamos brindarle una experiencia de gestión de autobuses sin problemas.</p>
            
            <p style="margin-bottom: 0;">Saludos cordiales,</p>
            <p style="margin-top: 5px;">El Equipo de Ahi voy & Ahi viene</p>
          </div>
        `;


        try {
            await sendEmail({ to: email, subject: emailSubject, html: emailBody });
        } catch (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Failed to send email' });
        }

        res.status(201).json({ message: 'Bus owner added successfully' });
    } catch (error) {
        console.error('Error adding bus owner:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { addOwner };