const express = require('express');
const app = express();
const helmet = require('helmet'); // Helps secure your apps by setting various HTTP headers
const morgan = require('morgan'); // HTTP request logger middleware
const cors = require('cors'); // Enables CORS with various options
const rateLimit = require('express-rate-limit'); // Basic rate-limiting middleware
const compression = require('compression'); // Compression middleware for gzip or deflate
const mongoSanitize = require('express-mongo-sanitize'); // Sanitize data to prevent MongoDB Operator Injection
const http = require('http').createServer(app);
const io = require('socket.io')(http);
// Routes
const userRoutes = require('./Routes/userRoute');
const adminRoutes = require('./Routes/adminRoute');
const passengerRoute = require('./Routes/passengerRoute');
const ownerRoute = require('./Routes/ownerRoute');
const driverRoute = require('./Routes/driverRoute');




//socket server
const driverSocketServer = require('./Socket/driverServer');
const setupBusLocationSocket = require('./Socket/busLocationSocket');

// Connect to Database
const connectDB = require('./Config/db');
connectDB();

// Middlewares
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(compression());
app.use(mongoSanitize());

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/passenger', passengerRoute);
app.use('/api/owner', ownerRoute);
app.use('/api/driver', driverRoute);



// Socket.IO server
driverSocketServer(io);
setupBusLocationSocket(io);


// Error handling middleware (Example)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find that!");
});

// Set up the server
const PORT = process.env.PORT || 8080;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));