const { Route } = require('../../../Model/route');
const { OwnerBus } = require('../../../Model/Owner');

const deleteRoute = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'You are not authorized to delete routes' });
    }

    const { routeId } = req.body;

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const ownerId = req.user._id;

    const owner = await OwnerBus.findOne({ userId: ownerId });

    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    if (route.ownerId.toString() !== owner._id.toString()) {
      return res.status(403).json({ error: 'You are not authorized to delete this route' });
    }

    await Route.findByIdAndDelete(routeId);

    res.status(200).json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { deleteRoute };