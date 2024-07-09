const { Route } = require('../../../Model/route');
const { OwnerBus } = require('../../../Model/Owner');

const deleteRoute = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'No estás autorizado para eliminar rutas.' });
    }

    const { routeId } = req.body;

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ error: 'Ruta no encontrada.' });
    }

    const ownerId = req.user._id;

    const owner = await OwnerBus.findOne({ userId: ownerId });

    if (!owner) {
      return res.status(404).json({ error: 'Propietario no encontrado.' });
    }

    if (route.ownerId.toString() !== owner._id.toString()) {
      return res.status(403).json({ error: 'No estás autorizado para eliminar esta ruta.' });
    }

    await Route.findByIdAndDelete(routeId);

    res.status(200).json({ message: 'Ruta eliminada con éxito.' });
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { deleteRoute };