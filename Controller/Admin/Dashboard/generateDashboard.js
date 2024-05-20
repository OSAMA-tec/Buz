const { Bus } = require('../../../Model/Bus'); 
const { Report } = require('../../../Model/report'); 

const getBusStatistics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'You are not authorized to add bus owners' });
    }
    const totalBuses = await Bus.countDocuments();
    const busesInOperation = await Bus.countDocuments({ driverId: { $ne: null } });
    const busesStopped = await Bus.countDocuments({ driverId: null });
    const totalReports = await Report.countDocuments();

    res.status(200).json({
      totalBuses,
      busesInOperation,
      busesStopped,
      totalReports
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bus statistics', error });
  }
};

module.exports = {
  getBusStatistics,
};
