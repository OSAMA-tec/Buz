const { Report } = require('../../Model/report');

const submitReport = async (req, res) => {
  try {
    const { busId, routeId, issueType, description, status } = req.body;
    const driverId = req.body.deviceToken;

    const newReport = new Report({
      busId,
      routeId,
      issueType,
      description,
      status,
      driverId,
    });

    const savedReport = await newReport.save();

    res.status(201).json(savedReport);
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateReport = async (req, res) => {
  try {
    const { reportId } = req.body;
    const { busId, routeId, issueType, description, status } = req.body;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ error: 'Informe no encontrado' });
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
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


module.exports = { submitReport,updateReport };