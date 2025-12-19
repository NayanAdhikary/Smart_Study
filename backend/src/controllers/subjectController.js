const Subject = require('../models/Subjects'); // Ensure path matches your structure, likely '../models/Subject.js' or '../models/Subjects.js' depending on your file name
const Department = require('../models/Department'); // Optional: Import Department if you need to validate the department ID exists

// @desc    Create subject
// @route   POST /api/subjects
// @access  Private (Requires authentication middleware like 'protect')
const createSubject = async (req, res) => {
    try {
        // 1. Extract fields matching the Subject model from req.body
        const { name, description, department } = req.body;

        // 2. Validate required fields based on the Mongoose model
        if (!name || !department) {
            // Use a more specific error message based on model requirements
            return res.status(400).json({ message: 'Please provide subject name and department ID' });
        }

        // 3. Get the user ID from the middleware (assuming 'protect' adds req.user.id)
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Not authorized, user ID missing from request token' });
        }

        // Optional validation: Check if the department ID actually exists
        // const departmentExists = await Department.findById(department);
        // if (!departmentExists) {
        //     return res.status(400).json({ message: 'Invalid Department ID' });
        // }

        // 4. Create the subject using the fields defined in the Mongoose schema
        const subject = await Subject.create({
            name,
            description, // Description is optional in the model, so it's okay if it's missing
            department,  // Department ID from req.body
            createdBy: req.user.id // Assign the logged-in user's ID to 'createdBy'
        });

        res.status(201).json(subject); // Send back the created subject

    } catch (error) {
        // Handle potential errors like duplicate names if you add unique constraints
        console.error("Error creating subject:", error); // Log the full error
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Get all subjects (optionally filtered by logged-in user)
// @route   GET /api/subjects
// @access  Private (Requires authentication middleware)
const getSubjects = async (req, res) => {
    try {
        const { department } = req.query;
        let query = {};

        if (department) {
            query.department = department;
        }

        // Find subjects based on the query
        const subjects = await Subject.find(query)
            .populate("department", "name") // Populate department name
            .populate("createdBy", "username email") // Populate creator info (optional)
            .lean();

        // Return empty array instead of 404 if no subjects found
        res.status(200).json(subjects);

    } catch (error) {
        console.error("Error getting subjects:", error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};


// @desc    Get single subject by ID
// @route   GET /api/subjects/:id
// @access  Private (Requires authentication middleware)
const getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id)
            .populate("department", "name")
            .populate("createdBy", "username email");

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        // Optional: Check if the subject belongs to the requesting user (if not admin)
        // if (subject.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        //    return res.status(403).json({ message: 'User not authorized to view this subject' });
        // }

        res.status(200).json(subject);
    } catch (error) {
        console.error("Error getting subject by ID:", error);
        // Handle CastError for invalid ObjectId format
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Subject ID format' });
        }
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private (Requires authentication middleware)
const updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        // Optional: Check ownership before updating (allow admins to update any)
        // if (subject.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        //     return res.status(403).json({ message: 'User not authorized to update this subject' });
        // }

        // Only allow updating specific fields (prevent changing createdBy, etc.)
        const { name, description, department } = req.body;
        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (department) {
            // Optional: Validate new department ID exists
            // const departmentExists = await Department.findById(department);
            // if (!departmentExists) return res.status(400).json({ message: 'Invalid Department ID' });
            updateData.department = department;
        }


        const updatedSubject = await Subject.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true } // Return the updated document
        ).populate("department", "name"); // Populate after update

        res.status(200).json(updatedSubject);
    } catch (error) {
        console.error("Error updating subject:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Subject ID format' });
        }
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private (Requires authentication middleware)
const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        // Optional: Check ownership before deleting (allow admins to delete any)
        // if (subject.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        //     return res.status(403).json({ message: 'User not authorized to delete this subject' });
        // }

        // Mongoose 5.x and below use .remove()
        // await subject.remove(); 
        // Mongoose 6.x and above use deleteOne() on the instance or findByIdAndDelete()
        await Subject.findByIdAndDelete(req.params.id);


        res.status(200).json({ message: 'Subject removed', id: req.params.id });
    } catch (error) {
        console.error("Error deleting subject:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Subject ID format' });
        }
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

module.exports = {
    createSubject,
    getSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject
};
