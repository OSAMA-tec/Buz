const { Bus } = require('../../Model/Bus');

const getAllBuses = async (req, res) => {
  try {
    const { wifi, menu, tv, ac, busType, type } = req.body;

    const filter = {};

    if (wifi !== undefined) {
      filter['amenities.wifi'] = wifi;
    }
    if (menu !== undefined) {
      filter['amenities.meals'] = menu;
    }
    if (tv !== undefined) {
      filter['amenities.tv'] = tv;
    }
    if (ac !== undefined) {
      filter['amenities.AC'] = ac;
    }
    if (busType && busType.length > 0) {
      filter.busType = { $in: busType };
    }
    if (type && type.length > 0) {
      filter.type = { $in: type };
    }

    const buses = await Bus.find(filter);

    res.status(200).json(buses);
  } catch (error) {
    console.error('Error getting buses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllBuses };