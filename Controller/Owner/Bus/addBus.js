const { Bus } = require('../../../Model/Bus');
const { Location } = require('../../../Model/location');
const { OwnerBus } = require('../../../Model/Owner');
const { uploadImageToFirebase } = require('../../../Firebase/uploadImage');

const addBus = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'You are not authorized to add buses' });
    }

    const { name, number, type, capacity, amenities, routeId, latitude, longitude } = req.body;

    const existingBus = await Bus.findOne({ number });
    if (existingBus) {
      return res.status(400).json({ error: 'Bus number already exists' });
    }

    let logoUrl = '';
    if (req.file) {
      const busLogo = req.file;
      const base64Image = busLogo.buffer.toString('base64');
      const contentType = busLogo.mimetype;

      try {
        logoUrl = await uploadImageToFirebase(base64Image, contentType);
      } catch (error) {
        console.error('Error uploading bus logo:', error);
        return res.status(500).json({ error: 'Failed to upload bus logo' });
      }
    }

    const ownerBus = await OwnerBus.findOne({ userId: req.user._id });
    if (!ownerBus) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    const newBus = new Bus({
      name,
      number,
      logoUrl,
      type,
      capacity,
      amenities,
      seatsAvailable: capacity,
      routeId,
      ownerId: ownerBus._id, 
    });

    const savedBus = await newBus.save();

    const newLocation = new Location({
      busId: savedBus._id,
      latitude,
      longitude,
    });

    await newLocation.save();

    res.status(201).json(savedBus);
  } catch (error) {
    console.error('Error adding bus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




const getAllBusesByOwner = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'You are not authorized to access this resource' });
    }

    const ownerId = req.user._id;

    const buses = await Bus.find({ ownerId: { $exists: true, $eq: ownerId } });

    res.status(200).json(buses);
  } catch (error) {
    console.error('Error getting buses by owner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { addBus,getAllBusesByOwner };