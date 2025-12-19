const PYQ = require('../models/PYQ');
const Subject = require('../models/Subjects');

// Create new PYQ
const createPYQ = async (req, res) => {
    try {
        const { subject: subjectId, title, year, description, department: departmentId } = req.body;
        let filePath = req.body.filePath;

        if (req.file) {
            filePath = req.file.path.replace(/\\/g, "/");
        }

        if (!subjectId || !title || !year || !departmentId || !filePath) {
            return res.status(400).json({ msg: 'Please provide subject ID, title, year, department ID, and file.' });
        }

        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ msg: 'Subject not found' });
        }

        const newPYQ = new PYQ({
            subject: subjectId,
            title,
            year,
            department: departmentId,
            description,
            filePath,
        });

        await newPYQ.save();
        res.status(201).json(newPYQ);
    } catch (error) {
        console.error("Error creating PYQ:", error);
        res.status(500).json({ msg: 'Server Error: ' + error.message });
    }
};


// Get all PYQs (optionally filtered by department)
// Get all PYQs (optionally filtered by department or subject)
const getAllPYQs = async (req, res) => {
    try {
        const { departmentId, subject } = req.query; // Optional filtering
        let query = {};

        if (subject) {
            query.subject = subject;
        } else if (departmentId) {
            // Find subjects in given department
            const subjectsInDept = await Subject.find({ department: departmentId }).select('_id');
            if (!subjectsInDept || subjectsInDept.length === 0) {
                return res.json([]);
            }
            const subjectIds = subjectsInDept.map(s => s._id);
            query.subject = { $in: subjectIds };
        }

        const pyqs = await PYQ.find(query).populate('subject', 'name').lean();
        res.json(pyqs);
    } catch (error) {
        console.error("Error fetching PYQs:", error);
        res.status(500).json({ msg: 'Server Error: ' + error.message });
    }
};

// Get PYQ by ID
const getPYQById = async (req, res) => {
    try {
        const pyq = await PYQ.findById(req.params.id).populate('subject', 'name');
        if (!pyq) {
            return res.status(404).json({ msg: 'PYQ not found' });
        }
        res.json(pyq);
    } catch (error) {
        console.error("Error fetching PYQ by ID:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ msg: 'Invalid PYQ ID format' });
        }
        res.status(500).json({ msg: 'Server Error: ' + error.message });
    }
};

// Update PYQ
// Update PYQ
const updatePYQ = async (req, res) => {
    try {
        let updateData = { ...req.body };

        if (req.file) {
            updateData.filePath = req.file.path.replace(/\\/g, "/");
        }

        const pyq = await PYQ.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('subject', 'name');
        if (!pyq) return res.status(404).json({ msg: 'PYQ not found' });
        res.json(pyq);
    } catch (error) {
        console.error("Error updating PYQ:", error);
        if (error.name === 'CastError') return res.status(400).json({ msg: 'Invalid PYQ ID format' });
        res.status(500).json({ msg: 'Server Error: ' + error.message });
    }
};

// Delete PYQ
const deletePYQ = async (req, res) => {
    try {
        const pyq = await PYQ.findByIdAndDelete(req.params.id);
        if (!pyq) return res.status(404).json({ msg: 'PYQ not found' });
        res.json({ msg: 'PYQ deleted successfully', id: req.params.id });
    } catch (error) {
        console.error("Error deleting PYQ:", error);
        if (error.name === 'CastError') return res.status(400).json({ msg: 'Invalid PYQ ID format' });
        res.status(500).json({ msg: 'Server Error: ' + error.message });
    }
};


module.exports = {
    createPYQ,
    getAllPYQs,
    getPYQById,
    updatePYQ,
    deletePYQ,
};

