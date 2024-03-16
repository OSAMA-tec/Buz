const io = require('socket.io-client');

const socket = io('http://localhost:8080/driver');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('driverStartSuccess', (message) => {
  console.log(`Server: ${message}`);
});

socket.on('error', (error) => {
  console.log(`Error: ${error}`);
});

socket.on('locationUpdate', ({ busId, latitude, longitude }) => {
  console.log(`Bus ${busId} location updated: ${latitude}, ${longitude}`);
});

socket.on('busStatusUpdate', ({ busId, delay, delayReason, arrivedLastStop, arrivedNextStop, seatsAvailable }) => {
  console.log(`Bus ${busId} status updated:`);
  console.log(`  Delay: ${delay}`);
  console.log(`  Delay Reason: ${delayReason}`);
  console.log(`  Arrived Last Stop: ${arrivedLastStop}`);
  console.log(`  Arrived Next Stop: ${arrivedNextStop}`);
  console.log(`  Seats Available: ${seatsAvailable}`);
});

// Test the 'driverStart' event
const startBus = (busNumber) => {
  socket.emit('driverStart', { busNumber });
};

// Test the 'locationUpdate' event
const updateLocation = (latitude, longitude) => {
  socket.emit('locationUpdate', { latitude, longitude });
};

// Test the 'updateBusStatus' event
const updateBusStatus = (delay, delayReason, arrivedLastStop, arrivedNextStop, seatsAvailable) => {
  socket.emit('updateBusStatus', { delay, delayReason, arrivedLastStop, arrivedNextStop, seatsAvailable });
};

// Test the 'driverStart' event
startBus('ABC-123');

// Test the 'locationUpdate' event
updateLocation(37.7749, -122.4194);

// Test the 'updateBusStatus' event
updateBusStatus('30 minutes', 'Traffic congestion', 'Main Street', 'Park Avenue', 25);