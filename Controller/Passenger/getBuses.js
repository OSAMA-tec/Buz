const { Bus } = require('../../Model/Bus');

const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();

    res.status(200).json(buses);
  } catch (error) {
    console.error('Error getting buses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllBuses };