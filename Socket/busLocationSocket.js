const { Location } = require('../Model/location');
const { Bus } = require('../Model/Bus');
const { Route } = require('../Model/route');

const setupBusLocationSocket = (io) => {
  const BusNamespace = io.of('/bus/location');
  
  BusNamespace.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('getBusLocation', async (busId) => {
      try {
        const location = await Location.findOne({ busId }).sort({ timestamp: -1 });
        const bus = await Bus.findById(busId);
        const route = await Route.findById(bus.routeId).populate('stops');

        if (!location) {
          socket.emit('error', 'No location found for the specified bus');
          return;
        }

        socket.emit('busLocation', {
          busId: location.busId,
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: location.timestamp,
          route: {
            origin: route.origin,
            destination: route.destination,
            stops: route.stops,
            distance: route.distance,
            estimatedTravelTime: route.estimatedTravelTime,
            waypoints: route.waypoints
          }
        });
      } catch (error) {
        console.error('Error retrieving bus location:', error);
        socket.emit('error', 'Failed to retrieve bus location');
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

module.exports = setupBusLocationSocket;
