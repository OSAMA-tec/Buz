
const { Bus } = require('../../Model/Bus');

const busStatusUpdate= async (req, res) => {
  try {
    const { busId } = req.body;
    const { delay, delayReason, arrivedLastStop, arrivedNextStop, seatsAvailable } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    if (delay !== undefined) {
      if (typeof delay !== 'string') {
        return res.status(400).json({ error: 'Delay must be a string' });
      }
      bus.delay = delay;
    }

    if (delayReason !== undefined) {
      if (typeof delayReason !== 'string') {
        return res.status(400).json({ error: 'Delay reason must be a string' });
      }
      bus.delayReason = delayReason;
    }

    if (arrivedLastStop !== undefined) {
      if (typeof arrivedLastStop !== 'string') {
        return res.status(400).json({ error: 'Arrived last stop must be a string' });
      }
      bus.arrivedLastStop = arrivedLastStop;
    }

    if (arrivedNextStop !== undefined) {
      if (typeof arrivedNextStop !== 'string') {
        return res.status(400).json({ error: 'Arrived next stop must be a string' });
      }
      bus.arrivedNextStop = arrivedNextStop;
    }

    if (seatsAvailable !== undefined) {
      if (typeof seatsAvailable !== 'number') {
        return res.status(400).json({ error: 'Seats available must be a number' });
      }
      bus.seatsAvailable = seatsAvailable;
    }

    await bus.save();

    res.json({ message: 'Bus status updated successfully' });
  } catch (error) {
    console.error('Error updating bus status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {busStatusUpdate};