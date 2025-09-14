const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Environment variables
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nabha_telemedicine_clean';
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Dynamic CORS origins based on environment
const getAllowedOrigins = () => {
  const baseOrigins = [
    "http://localhost:3000",
    "http://localhost:19000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:19000"
  ];
  
  // Add network IPs dynamically
  const networkIPs = ["192.168.1.5", "192.168.1.6", "10.0.0.1"];
  const ports = [3000, 19000, 8081];
  
  networkIPs.forEach(ip => {
    ports.forEach(port => {
      baseOrigins.push(`http://${ip}:${port}`);
      baseOrigins.push(`exp://${ip}:${port}`);
    });
  });
  
  return baseOrigins;
};

// Socket.IO setup for real-time communication
const io = socketIo(server, {
  cors: {
    origin: getAllowedOrigins(),
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Make io available to routes
app.set('io', io);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "http://localhost:8080", 
    "http://192.168.1.5:3000",
    "http://192.168.1.6:3000", 
    "http://localhost:19000",
    "http://192.168.1.5:19000",
    "http://192.168.1.6:19000",
    "exp://192.168.1.5:19000",
    "exp://192.168.1.6:19000"
  ],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with environment variable
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log(`📍 Database: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/asha', require('./routes/asha'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/pharmacy', require('./routes/pharmacy'));
app.use('/api/sos', require('./routes/sos'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/health-records', require('./routes/healthRecords'));
app.use('/api/prescriptions', require('./routes/prescriptions'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Nabha Telemedicine API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('📱 Client connected:', socket.id);
  
  // Join rooms for different user types
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`🏠 Socket ${socket.id} joined room: ${room}`);
  });

  // Mobile App to Web Communication
  socket.on('mobile-to-web', (data) => {
    console.log('📱 ➡️ 🌐 Mobile to Web:', data);
    socket.broadcast.emit('mobile-to-web', {
      ...data,
      socketId: socket.id,
      timestamp: new Date().toISOString()
    });
  });

  // Web to Mobile App Communication  
  socket.on('web-to-mobile', (data) => {
    console.log('🌐 ➡️ 📱 Web to Mobile:', data);
    socket.broadcast.emit('web-to-mobile', {
      ...data,
      socketId: socket.id,
      timestamp: new Date().toISOString()
    });
  });

  // Emergency Help Requests
  socket.on('help-request', (data) => {
    console.log('🆘 HELP REQUEST:', data);
    // Broadcast to all admin/doctor clients
    io.emit('help-request', {
      ...data,
      socketId: socket.id,
      timestamp: new Date().toISOString(),
      priority: 'high'
    });
  });

  // Emergency Alerts from Admin
  socket.on('emergency-alert', (data) => {
    console.log('🚨 EMERGENCY ALERT:', data);
    // Broadcast to all connected clients
    io.emit('emergency-alert', {
      ...data,
      socketId: socket.id,
      timestamp: new Date().toISOString(),
      priority: 'critical'
    });
  });

  // ASHA Worker communications
  socket.on('asha-report', (data) => {
    console.log('👩‍⚕️ ASHA Report:', data);
    socket.broadcast.emit('asha-report', {
      ...data,
      socketId: socket.id,
      timestamp: new Date().toISOString()
    });
  });

  // Patient Status Updates
  socket.on('patient-status-update', (data) => {
    console.log('🤒 Patient Status Update:', data);
    socket.broadcast.emit('patient-status-update', {
      ...data,
      socketId: socket.id,
      timestamp: new Date().toISOString()
    });
  });

  // Doctor Consultation Events
  socket.on('consultation-request', (data) => {
    console.log('👨‍⚕️ Consultation Request:', data);
    socket.broadcast.emit('consultation-request', {
      ...data,
      socketId: socket.id,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Start server using environment variables
server.listen(PORT, HOST, () => {
  console.log(`🚀 Nabha Telemedicine Server Started`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Host: ${HOST}`);
  console.log(`🔧 Environment: ${NODE_ENV}`);
  console.log(`💾 Database: ${MONGODB_URI.includes('localhost') ? 'Local MongoDB' : 'Remote MongoDB'}`);
  console.log(`🔌 Socket.IO: Enabled for real-time sync`);
  console.log(`\n📡 Server accessible at:`);
  console.log(`  - Local: http://localhost:${PORT}`);
  console.log(`  - Network: http://192.168.1.5:${PORT}`);
  console.log(`  - Network: http://192.168.1.6:${PORT}`);
  console.log(`\n🔗 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📱 Mobile App API: http://192.168.1.5:${PORT}/api`);
});
