const { Bus } = require('../../../Model/Bus');
const { Location } = require('../../../Model/location');
const { OwnerBus } = require('../../../Model/Owner');
const { Route } = require('../../../Model/route');

const deleteBus = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'No estás autorizado para eliminar autobuses.' });
    }

    const { busId } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Autobús no encontrado.' });
    }

    const ownerId = req.user._id;

    const owner = await OwnerBus.findOne({ userId: ownerId });
    if (!owner) {
      return res.status(404).json({ error: 'Propietario no encontrado.' });
    }

    if (bus.ownerId.toString() !== owner._id.toString()) {
      return res.status(403).json({ error: 'No estás autorizado para eliminar este autobús.' });
    }

    await Location.deleteMany({ busId: bus._id });

    if (bus.routeId) {
      // Delete the associated route if it exists
      await Route.findByIdAndDelete(bus.routeId);
    }

    await Bus.findByIdAndDelete(bus._id);

    res.status(200).json({ message: 'Autobús, ubicaciones asociadas y ruta eliminados con éxito.' });
  } catch (error) {
    console.error('Error al eliminar el autobús:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { deleteBus };