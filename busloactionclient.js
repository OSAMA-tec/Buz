const io = require('socket.io-client');

const socket = io('http://localhost:8080/bus/location');

const busId = '65efbd0569cebf8c21303562';

socket.on('connect', () => {
  console.log('Connected to server');

  socket.emit('getBusLocation', busId);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('busLocation', (data) => {
  console.log('Bus location received:', data);
  const { busId, latitude, longitude, timestamp } = data;
  console.log(`Bus ${busId} is at (${latitude}, ${longitude}) as of ${timestamp}`);
});

socket.on('error', (error) => {
  console.error('Error:', error);
});
