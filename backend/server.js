const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const cors = require('cors');


dotenv.config();
connectDB();

const app = express();

app.use(cors());
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
