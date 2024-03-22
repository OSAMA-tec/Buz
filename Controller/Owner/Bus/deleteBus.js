const { Bus } = require('../../../Model/Bus');
const { Location } = require('../../../Model/location');

const deleteBus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to delete buses' });
    }

    const { busId } = req.body;

    // Find the bus by ID
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    await Location.deleteMany({ busId: bus._id });

    // Delete the bus
    await Bus.findByIdAndDelete(busId);

    res.status(200).json({ message: 'Bus and associated locations deleted successfully' });
  } catch (error) {
    console.error('Error deleting bus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { deleteBus };