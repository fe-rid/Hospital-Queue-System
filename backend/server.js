const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express    = require('express');
const cors       = require('cors');
const connectDB  = require('./config/db');

const patientRoutes = require('./routes/patientRoutes');
const queueRoutes   = require('./routes/queueRoutes');
const doctorRoutes  = require('./routes/doctorRoutes');

// Initialize MongoDB
connectDB();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    system:  'SmartHealth Persistence Engine',
    status:  'Connected to MongoDB Atlas',
    uptime:  `${Math.floor(process.uptime())}s`
  });
});

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/queue',    queueRoutes);
app.use('/api/doctors',  doctorRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(500).json({ success: false, message: 'Server error' });
});

app.listen(PORT, () => {
  console.log(`\n══════════════════════════════════════════════════`);
  console.log(`  🏥  SmartHealth Persistent Platform  v3.0`);
  console.log(`══════════════════════════════════════════════════`);
  console.log(`  Port     : ${PORT}`);
  console.log(`  Database : MongoDB Atlas Persistent Cloud`);
  console.log(`──────────────────────────────────────────────────\n`);
});
