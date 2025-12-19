const Notes = require('../models/Notes');
const Subject = require('../models/Subjects');

// Create notes
const createNotes = async (req, res) => {
  try {
    const { subject: subjectId, title, description } = req.body;
    let filePath = req.body.filePath; // Allow manual path if provided

    // If file uploaded via Multer, use that path
    if (req.file) {
      filePath = req.file.path.replace(/\\/g, "/"); // Normalize slashes for Windows
    }

    // Validate required fields
    if (!subjectId || !title || !filePath) {
      return res.status(400).json({ msg: 'Please provide subject ID, title, and file.' });
    }

    // Validate subject existence
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ msg: 'Subject not found' });
    }

    // Create and save notes document
    const notes = new Notes({
      subject: subjectId,
      title,
      description,
      filePath,
    });

    const savedNotes = await notes.save();
    res.status(201).json(savedNotes);

  } catch (error) {
    console.error("Error creating notes:", error);
    res.status(500).json({ msg: 'Server Error: ' + error.message });
  }
};

// Get all notes (optionally filtered by department)
const getAllNotes = async (req, res) => {
  try {
    const { departmentId } = req.query;
    let query = {};

    if (departmentId) {
      // Get subjects under the department
      const subjectsInDept = await Subject.find({ department: departmentId }).select('_id');
      if (!subjectsInDept.length) {
        return res.json([]);
      }
      const subjectIds = subjectsInDept.map(s => s._id);
      query.subject = { $in: subjectIds };
    }

    // Find notes and populate subject names
    const notes = await Notes.find(query).populate('subject', 'name').lean();
    res.json(notes);

  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ msg: 'Server Error: ' + error.message });
  }
};

// Get notes by ID
const getNotesById = async (req, res) => {
  try {
    const notes = await Notes.findById(req.params.id).populate('subject', 'name');
    if (!notes) {
      return res.status(404).json({ msg: 'Notes not found' });
    }
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes by ID:", error);
    if (error.name === 'CastError') {
      return res.status(400).json({ msg: 'Invalid Notes ID format' });
    }
    res.status(500).json({ msg: 'Server Error: ' + error.message });
  }
};

// Delete note by ID
const deleteNote = async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }
    await note.deleteOne();
    res.json({ msg: 'Note removed' });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ msg: 'Server Error: ' + error.message });
  }
};

// Update Notes
const updateNotes = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.file) {
      updateData.filePath = req.file.path.replace(/\\/g, "/");
    }

    const note = await Notes.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('subject', 'name');
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    res.json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ msg: 'Server Error: ' + error.message });
  }
};

module.exports = {
  createNotes,
  getAllNotes,
  getNotesById,
  deleteNote,
  updateNotes
};
