const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
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

const Notes = mongoose.model('Notes', notesSchema);
module.exports = Notes;
