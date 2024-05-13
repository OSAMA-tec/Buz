const { User } = require('../../../Model/User');
const { OwnerBus } = require('../../../Model/Owner');
const bcrypt = require('bcrypt');
const sendEmail = require('../../../Notification-Worker/sendEmail');

const updateOwner = async (req, res) => {
  try {
    const { ownerId } = req.body;
    const {
      name,
      email,
      password,
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
      return res.status(403).json({ error: 'You are not authorized to update bus owners' });
    }

    const ownerBus = await OwnerBus.findOne({userId:ownerId });
    if (!ownerBus) {
      return res.status(404).json({ error: 'Bus owner not found' });
    }

    const owner = await User.findById(ownerBus.userId);
    if (!owner || owner.role !== 'owner') {
      return res.status(404).json({ error: 'User not found or not a bus owner' });
    }

    owner.name = name || owner.name;
    owner.phoneNo = phoneNo || owner.phoneNo;
    owner.contactDetails = contactDetails || owner.contactDetails;

    if (email && email !== owner.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      owner.email = email;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      owner.password = hashedPassword;
    }

    await owner.save();

    ownerBus.companyName = companyName || ownerBus.companyName;
    ownerBus.companyLocation = companyLocation || ownerBus.companyLocation;
    ownerBus.numberOfBuses = numberOfBuses || ownerBus.numberOfBuses;
    ownerBus.contactPerson = contactPerson || ownerBus.contactPerson;
    ownerBus.registrationNumber = registrationNumber || ownerBus.registrationNumber;
    ownerBus.establishedYear = establishedYear || ownerBus.establishedYear;
    await ownerBus.save();

    if (email && email !== owner.email) {
      const emailSubject = 'Bus Owner Account Updated';
      const emailBody = `
        <div>
          <p>Dear ${name},</p>
          <p>Your bus owner account has been successfully updated. Your updated email is: ${email}</p>
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          <p>Thank you for using our service.</p>
          <p>Best regards,</p>
          <p>The Bus App Team</p>
        </div>
      `;
      await sendEmail({ to: email, subject: emailSubject, html: emailBody });
    }

    res.status(200).json({ message: 'Bus owner updated successfully' });
  } catch (error) {
    console.error('Error updating bus owner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { updateOwner };