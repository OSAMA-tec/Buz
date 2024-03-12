const { Route } = require('../../../Model/route');

const deleteRoute = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to delete routes' });
    }

    const { routeId } = req.body;

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    await Route.findByIdAndDelete(routeId);

    res.status(200).json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { deleteRoute };