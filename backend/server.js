const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const cors = require('cors');


dotenv.config();
connectDB();

const app = express();

// CORS configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://smart-study-rules-phi.vercel.app', // Your Vercel deployment URL
    // Add more Vercel URLs if needed (preview deployments)
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Middleware to parse JSON
app.use('/uploads', express.static('uploads'));


// Other API routes
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/departments', require('./src/routes/departmentRoutes'));
app.use('/api/subjects', require('./src/routes/subjectRoutes'));
app.use('/api/syllabus', require('./src/routes/syllabusRoutes'));
app.use('/api/notes', require('./src/routes/notesRoutes'));
app.use('/api/pyqs', require('./src/routes/pyqRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/subscribe', require('./src/routes/subscriberRoutes'));
app.use('/api/admin/settings', require('./src/routes/adminSettingsRoutes'));
app.use('/api/predict', require('./src/routes/predictRoutes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
