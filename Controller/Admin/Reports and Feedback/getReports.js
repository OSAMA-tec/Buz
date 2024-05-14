const { Report } = require('../../../Model/report');
const { Bus } = require('../../../Model/Bus');
const { User } = require('../../../Model/User');

const getAllReports = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to access reports' });
    }

    const reports = await Report.find();

    const populatedReports = [];

    for (const report of reports) {
      try {
        const bus = await Bus.findById(report.busId);
        const passenger = await User.findById(report.passengerId);

        const populatedReport = {
          _id: report._id,
          issueType: report.issueType,
          description: report.description,
          timestamp: report.timestamp,
          status: report.status,
          bus: bus ? bus.toObject() : null,
          passenger: passenger ? passenger.toObject() : null,
        };

        populatedReports.push(populatedReport);
      } catch (error) {
        console.error(`Error populating report with ID ${report._id}:`, error);
      }
    }

    res.status(200).json(populatedReports);
  } catch (error) {
    console.error('Error retrieving reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllReports };