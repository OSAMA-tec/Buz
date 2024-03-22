const { Bus } = require('../../../Model/Bus');
const { uploadImageToFirebase } = require('../../../Firebase/uploadImage');

const updateBus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to update buses' });
    }

    const { busId, name, number, type, capacity, amenities, routeId } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    if (name) bus.name = name;
    if (number) bus.number = number;
    if (type) bus.type = type;
    if (capacity) bus.capacity = capacity;
    if (amenities) bus.amenities = amenities;
    if (routeId) bus.routeId = routeId;

    if (req.file) {
      const busLogo = req.file;
      const base64Image = busLogo.buffer.toString('base64');
      const contentType = busLogo.mimetype;

      try {
        const logoUrl = await uploadImageToFirebase(base64Image, contentType);
        bus.logoUrl = logoUrl;
      } catch (error) {
        console.error('Error uploading bus logo:', error);
        return res.status(500).json({ error: 'Failed to upload bus logo' });
      }
    }

    const updatedBus = await bus.save();

    res.status(200).json(updatedBus);
  } catch (error) {
    console.error('Error updating bus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { updateBus };