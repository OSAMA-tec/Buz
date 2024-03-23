const { User } = require('../../Model/User');
const { Bus } = require('../../Model/Bus');
const { Route } = require('../../Model/route');
const getBusesByRoute = async (req, res) => {
  try {
    const { origin, destination } = req.query;
    const userId = req.user._id;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const originLowerCase = origin.toLowerCase();
    const destinationLowerCase = destination.toLowerCase();

    const routes = await Route.find({
      $or: [
        { origin: { $regex: new RegExp(originLowerCase, 'i') }, destination: { $regex: new RegExp(destinationLowerCase, 'i') } },
        { origin: { $regex: new RegExp(destinationLowerCase, 'i') }, destination: { $regex: new RegExp(originLowerCase, 'i') } },
        { stops: { $in: [new RegExp(originLowerCase, 'i'), new RegExp(destinationLowerCase, 'i')] } },
      ],
    });

    if (routes.length === 0) {
      return res.status(404).json({ error: 'No routes found for the given origin and destination' });
    }

    // Retrieve the bus details for each route
    const busDetails = await Promise.all(
      routes.map(async (route) => {
        const buses = await Bus.find({ routeId: route._id });
        return buses.map((bus) => ({
          busId: bus._id,
          number: bus.number,
          name: bus.name,
          logoUrl:bus.logoUrl,
          type: bus.type,
          capacity: bus.capacity,
          seatsAvailable:bus.seatsAvailable,
          amenities: bus.amenities,
          Avilable:bus.avilable,
          delay:bus.delay,
          delayReason:bus.delayReason,
          arrivedLastStop:bus.arrivedLastStop,
          arrivedNextStop:bus.arrivedNextStop,
          origin: route.origin,
          destination: route.destination,
          stops: route.stops,
        }));
      })
    );

    const flattenedBusDetails = busDetails.flat();
    res.status(200).json({ buses: flattenedBusDetails });
  } catch (error) {
    console.error('Error retrieving buses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = { getBusesByRoute };