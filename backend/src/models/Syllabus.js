const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    // Establishes a relationship with the Subject model
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    // Stores the path to the uploaded PDF file
    filePath: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Syllabus = mongoose.model('Syllabus', syllabusSchema);
module.exports = Syllabus;