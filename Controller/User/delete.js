const { User } = require('../../Model/User');

const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Check if the user is an admin
    if (user.role === 'admin') {
      return res.status(403).json({ error: 'No se puede eliminar el usuario administrador.' });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'Usuario eliminado con éxito.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { deleteUser };