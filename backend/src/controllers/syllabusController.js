const Syllabus = require('../models/Syllabus');
const Subject = require('../models/Subjects');

// Get all syllabus
const getAllSyllabus = async (req, res) => {
  try {
    const { departmentId } = req.query;
    let filter = {};

    if (departmentId) {
      // Find all subjects belonging to this department
      const subjects = await Subject.find({ department: departmentId }).select('_id');
      const subjectIds = subjects.map(s => s._id);
      filter = { subject: { $in: subjectIds } };
    }

    const syllabusList = await Syllabus.find(filter)
      .populate({
        path: 'subject',
        populate: { path: 'department' }
      });
    res.json(syllabusList);
  } catch (error) {
    res.status(500).json({ msg: 'Failed to fetch syllabus' });
  }
};

// Get syllabus by ID
const getSyllabusById = async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id);
    if (!syllabus) {
      return res.status(404).json({ msg: 'Syllabus not found' });
    }
    res.json(syllabus);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching syllabus' });
  }
};

const createSyllabus = async (req, res) => {
  try {
    const { year, subject: subjectId, title } = req.body;
    let filePath = req.body.filePath;

    if (req.file) {
      filePath = req.file.path.replace(/\\/g, "/");
    }

    // Validate required fields
    if (!year || !subjectId || !filePath || !title) {
      return res.status(400).json({
        msg: 'Please provide year, subject ID, file, and title.'
      });
    }

    // Validate subject exists
    const subjectDoc = await Subject.findById(subjectId);
    if (!subjectDoc) {
      return res.status(404).json({ msg: 'Subject not found with the provided ID.' });
    }

    // Create new syllabus document using provided title
    const newSyllabus = new Syllabus({
      title,
      year,
      subject: subjectId,
      filePath,
    });

    const savedSyllabus = await newSyllabus.save();
    res.status(201).json({ msg: 'Syllabus created successfully', data: savedSyllabus });

  } catch (error) {
    res.status(500).json({ msg: 'Server Error: ' + error.message });
  }
};

// Delete Syllabus
const deleteSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findByIdAndDelete(req.params.id);
    if (!syllabus) return res.status(404).json({ msg: 'Syllabus not found' });
    res.json({ msg: 'Syllabus deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server Error: ' + error.message });
  }
};

// Update Syllabus
const updateSyllabus = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.file) {
      updateData.filePath = req.file.path.replace(/\\/g, "/");
    }

    const syllabus = await Syllabus.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!syllabus) return res.status(404).json({ msg: 'Syllabus not found' });
    res.json(syllabus);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error: ' + error.message });
  }
};

module.exports = {
  getAllSyllabus,
  getSyllabusById,
  createSyllabus,
  deleteSyllabus,
  updateSyllabus
};
