const mongoose = require('mongoose');

const pyqSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    department: {  // Changed from stream to department reference
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
}, { timestamps: true });


const PYQ = mongoose.model('PYQ', pyqSchema);
module.exports = PYQ;
