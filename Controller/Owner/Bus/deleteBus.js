const { Bus } = require('../../../Model/Bus');
const { Location } = require('../../../Model/location');
const { OwnerBus } = require('../../../Model/Owner');

const deleteBus = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'You are not authorized to delete buses' });
    }

    const { busId } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    const ownerId = req.user._id;

    const owner = await OwnerBus.findOne({ userId: ownerId });

    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    if (bus.ownerId.toString() !== owner._id.toString()) {
      return res.status(403).json({ error: 'You are not authorized to delete this bus' });
    }

    await Location.deleteMany({ busId: bus._id });

    await Bus.findByIdAndDelete(busId);

    res.status(200).json({ message: 'Bus and associated locations deleted successfully' });
  } catch (error) {
    console.error('Error deleting bus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { deleteBus };