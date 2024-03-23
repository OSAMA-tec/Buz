const { User } = require('../../../Model/User');
const {OwnerBus} = require('../../../Model/Owner');
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

        const newOwnerBus = new OwnerBus({
            userId: savedOwner._id,
            companyName,
            companyLocation,
            numberOfBuses,
            contactPerson,
            registrationNumber,
            establishedYear
        });

        await newOwnerBus.save();

        const emailSubject = 'Bus Owner Account Created';
        const emailBody = `
      <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #cccccc; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://example.com/logo.png" alt="Bus App Logo" style="max-width: 200px;">
        </div>
        
        <p>Dear ${name},</p>
        
        <p>Congratulations! Your bus owner account has been successfully created. Please use the following credentials to log in:</p>
        
        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="padding: 10px; background-color: #f2f2f2; border: 1px solid #cccccc; font-weight: bold;">Email:</td>
            <td style="padding: 10px; border: 1px solid #cccccc;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: #f2f2f2; border: 1px solid #cccccc; font-weight: bold;">Password:</td>
            <td style="padding: 10px; border: 1px solid #cccccc;">${password}</td>
          </tr>
        </table>
        
        <p style="color: #ff0000; font-weight: bold;">Important: Please change your password after logging in for the first time to ensure the security of your account.</p>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team at <a href="mailto:support@busapp.com" style="color: #007bff; text-decoration: none;">support@busapp.com</a>.</p>
        
        <p>Thank you for choosing Bus App. We look forward to providing you with a seamless bus management experience.</p>
        
        <p style="margin-bottom: 0;">Best regards,</p>
        <p style="margin-top: 5px;">The Bus App Team</p>
      </div>
    `;
        await sendEmail({ to: email, subject: emailSubject, html: emailBody });

        res.status(201).json({ message: 'Bus owner added successfully' });
    } catch (error) {
        console.error('Error adding bus owner:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { addOwner }