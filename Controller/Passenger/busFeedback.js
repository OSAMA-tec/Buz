const { Feedback } = require('../../Model/feedback');
const { Bus } = require('../../Model/Bus');
const { User } = require('../../Model/User');

const createFeedback = async (req, res) => {
  try {
    const { busId, routeId, issue, description, recommendations, service } = req.body;
    const passengerId = req.user._id;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Autobús no encontrado.' });
    }

    const newFeedback = new Feedback({
      passengerId,
      routeId,
      issue,
      description,
      recommendations,
      service,
      driverId: bus.driverId,
    });

    const savedFeedback = await newFeedback.save();

    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getFeedbackByBus = async (req, res) => {
  try {
    const { busId } = req.query;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Autobús no encontrado.' });
    }

    const feedback = await Feedback.find({ driverId: bus.driverId });

    const populatedFeedback = await Promise.all(
      feedback.map(async (item) => {
        const passenger = await User.findById(item.passengerId);
        return {
          _id: item._id,
          passenger: passenger ? passenger.toObject() : null,
          routeId: item.routeId,
          issue: item.issue,
          description: item.description,
          recommendations: item.recommendations,
          timestamp: item.timestamp,
          service: item.service,
        };
      })
    );

    res.status(200).json(populatedFeedback);
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { createFeedback, getFeedbackByBus };