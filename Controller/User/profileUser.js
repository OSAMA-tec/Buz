const { User } = require('../../Model/User');
const { uploadImageToFirebase } = require('../../Firebase/uploadImage');
const { isPasswordValid, generatePasswordHash } = require('../../Utils/password');


const updateProfile = async (req, res) => {
  try {
    const { name, email, phoneNo, currentPassword, updatedPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNo) user.phoneNo = phoneNo;

    if (currentPassword && updatedPassword) {
      const isValid = isPasswordValid(currentPassword, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Contraseña actual actual inválida.' });
      }

      const hashedPassword = generatePasswordHash(updatedPassword);
      user.password = hashedPassword;
    }

    if (req.file) {
      const profilePicture = req.file;
      const base64Image = profilePicture.buffer.toString('base64');
      const contentType = profilePicture.mimetype;

      try {
        const imageUrl = await uploadImageToFirebase(base64Image, contentType);
        user.profileUrl = imageUrl;
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        return res.status(500).json({ error: 'Error al subir la foto de perfil.' });
      }
    }

    await user.save();

    res.status(200).json({ message: 'Perfil actualizado con éxito.' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.user._id; 

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Exclude sensitive fields from the response
    const { password, otp, otpVerified, ...userInfo } = user.toObject();

    res.status(200).json(userInfo);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { updateProfile,getUser };