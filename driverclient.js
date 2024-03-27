const io = require('socket.io-client');

const socket = io('http://localhost:8080/driver');

const deviceToken = 'osamadriver';

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

// Test the 'driverStart' event
const startBus = () => {
  socket.emit('driverStart');
};

// Test the 'locationUpdate' event
const updateLocation = (latitude, longitude) => {
  socket.emit('locationUpdate', { latitude, longitude, deviceToken });
};

// Disconnect the driver
const disconnectDriver = () => {
  socket.disconnect();
};

// Test the 'driverStart' event
startBus();

// Test the 'locationUpdate' event
updateLocation(37.7749, -122.4194);

// Disconnect the driver after 10hours seconds
setTimeout(disconnectDriver, 36000000);