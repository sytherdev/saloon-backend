const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();


app.use(express.json({ limit: '5mb' }))  // or even '10mb' if needed
app.use(express.urlencoded({ extended: true, limit: '5mb' }))

// Middleware
app.use(cors({
    origin: 'https://saloon-sooty.vercel.app',  // ✅ set to your frontend domain
    credentials: true
}));
// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./services/serviceRoutes.js'));
app.use('/api/working-hours', require('./routes/workingHourRoutes'));
app.use('/api/team', require('./routes/teamMemberRoutes'));
app.use('/api/salons', require('./routes/salonRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
// Swagger
require('./swagger/swagger')(app);

module.exports = app;
