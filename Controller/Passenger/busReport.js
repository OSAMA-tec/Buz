const { Report } = require('../../Model/report');

const submitReport = async (req, res) => {
  try {
    const { busId, routeId, issueType, description } = req.body;
    const passengerId = req.user._id;

    const newReport = new Report({
      passengerId,
      busId,
      routeId,
      issueType,
      description,
    });

    const savedReport = await newReport.save();

    res.status(201).json(savedReport);
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const updateReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { busId, routeId, issueType, description, status } = req.body;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    if (report.passengerId !== req.user._id) {
        return res.status(403).json({ error: 'You are not authorized to update this report' });
      }
  
    if (busId) report.busId = busId;
    if (routeId) report.routeId = routeId;
    if (issueType) report.issueType = issueType;
    if (description) report.description = description;
    if (status) report.status = status;

    const updatedReport = await report.save();

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { submitReport,updateReport };