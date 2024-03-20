const { Bus } = require('../../Model/Bus');
const { Route } = require('../../Model/route');

const planTrip = async (req, res) => {
  try {
    const { origin, destination } = req.body;

    const route = await Route.findOne({
      $or: [
        { origin, destination },
        { stops: { $all: [origin, destination] } },
        { origin: { $in: ['', ...route.stops] }, destination: { $in: ['', ...route.stops] } },
      ],
    });

    if (!route) {
      return res.status(404).json({ error: 'No route found for the provided origin and destination' });
    }

    const originIndex = route.stops.indexOf(origin) !== -1 ? route.stops.indexOf(origin) : -1;
    const destinationIndex = route.stops.indexOf(destination) !== -1 ? route.stops.indexOf(destination) : -1;

    if (originIndex === -1 || destinationIndex === -1 || originIndex >= destinationIndex) {
      return res.status(400).json({ error: 'Invalid origin and destination combination' });
    }

    const buses = await Bus.find({ routeId: route._id, available: true });

    res.status(200).json({ route, buses });
  } catch (error) {
    console.error('Error planning trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { planTrip };