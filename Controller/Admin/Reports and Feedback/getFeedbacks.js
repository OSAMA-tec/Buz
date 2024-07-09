const { Feedback } = require('../../../Model/feedback');
const { Bus } = require('../../../Model/Bus');
const { User } = require('../../../Model/User');

const getAllFeedback = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to access this resource' });
    }

    const feedback = await Feedback.find();

    const populatedFeedback = [];

    for (const item of feedback) {
      const passenger = await User.findById(item.passengerId);

      const bus = await Bus.findOne({ driverId: item.driverId });

      const populatedItem = {
        _id: item._id,
        passenger: passenger ? passenger.toObject() : null,
        bus: bus ? bus.toObject() : null,
        routeId: item.routeId,
        issue: item.issue,
        description: item.description,
        recommendations: item.recommendations,
        timestamp: item.timestamp,
        service: item.service,
      };

      populatedFeedback.push(populatedItem);
    }

    res.status(200).json(populatedFeedback);
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getAllFeedback };