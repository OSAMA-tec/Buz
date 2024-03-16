const { Bus } = require('../Model/Bus');
const { Location } = require('../Model/location');

const driverSocketServer = (io) => {
  const driverNamespace = io.of('/driver');

  driverNamespace.on('connection', (socket) => {
    console.log('A driver connected');

    socket.on('driverStart', async ({ busNumber }) => {
      try {
        const bus = await Bus.findOne({ number: busNumber });
        if (!bus) {
          socket.emit('error', 'Bus not found');
          return;
        }

        bus.driverId = socket.id;
        bus.available = true;
        await bus.save();

        socket.emit('driverStartSuccess', 'Bus started successfully');
      } catch (error) {
        console.error('Error starting bus:', error);
        socket.emit('error', 'Failed to start bus');
      }
    });

    socket.on('locationUpdate', async ({ latitude, longitude }) => {
      try {
        const bus = await Bus.findOne({ driverId: socket.id });
        if (!bus) {
          socket.emit('error', 'Bus not found');
          return;
        }

        const newLocation = new Location({
          busId: bus._id,
          latitude,
          longitude,
        });
        await newLocation.save();

        driverNamespace.emit('locationUpdate', { busId: bus._id, latitude, longitude });
      } catch (error) {
        console.error('Error updating location:', error);
        socket.emit('error', 'Failed to update location');
      }
    });
    socket.on('updateBusStatus', async ({ delay, delayReason, arrivedLastStop, arrivedNextStop, seatsAvailable }) => {
      try {
        const bus = await Bus.findOne({ driverId: socket.id });
        if (!bus) {
          socket.emit('error', 'Bus not found');
          return;
        }

        if (delay) bus.delay = delay;
        if (delayReason) bus.delayReason = delayReason;
        if (arrivedLastStop) bus.arrivedLastStop = arrivedLastStop;
        if (arrivedNextStop) bus.arrivedNextStop = arrivedNextStop;
        if (seatsAvailable) bus.seatsAvailable = seatsAvailable;

        await bus.save();

        driverNamespace.emit('busStatusUpdate', {
          busId: bus._id,
          delay: bus.delay,
          delayReason: bus.delayReason,
          arrivedLastStop: bus.arrivedLastStop,
          arrivedNextStop: bus.arrivedNextStop,
          seatsAvailable: bus.seatsAvailable,
        });
      } catch (error) {
        console.error('Error updating bus status:', error);
        socket.emit('error', 'Failed to update bus status');
      }
    });

    socket.on('disconnect', async () => {
      console.log('A driver disconnected');
      try {
        const bus = await Bus.findOne({ driverId: socket.id });
        if (bus) {
          bus.driverId = null;
          bus.available = false;
          await bus.save();
        }
      } catch (error) {
        console.error('Error handling disconnection:', error);
      }
    });
  });
};

module.exports = driverSocketServer;
