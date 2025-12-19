const User = require('../models/User');
const Note = require('../models/Notes');
const Department = require('../models/Department');
const Subject = require('../models/Subjects');
const PYQ = require('../models/PYQ');
const Syllabus = require('../models/Syllabus');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ created_at: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const [users, notes, departments, subjects, pyqs, syllabus] = await Promise.all([
            User.countDocuments(),
            Note.countDocuments(),
            Department.countDocuments(),
            Subject.countDocuments(),
            PYQ.countDocuments(),
            Syllabus.countDocuments()
        ]);

        res.json({
            users,
            notes,
            departments,
            subjects,
            pyqs,
            syllabus
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    getStats
};
