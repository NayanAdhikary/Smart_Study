const Department = require('../models/Department');

// ✅ Create Department
const createDepartment = async (req, res) => {
    try {
        const { name, description, createdBy } = req.body;
        const department = new Department({ name, description, createdBy });
        await department.save();
        res.status(201).json(department);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Get All Departments
const getDepartments = async (req, res) => {
    try {
        // Comment population to test
        // const departments = await Department.find().populate("createdBy", "name email");
        const departments = await Department.find(); // Without populate
        console.log(`API: Fetching departments. Count: ${departments.length}`); // Debug Log
        console.log('Departments found:', JSON.stringify(departments, null, 2)); // Debug Log
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ✅ Get Department By ID
const getDepartmentById = async (req, res) => {
    try {
        // Initially try without populate
        const department = await Department.findById(req.params.id);
        if (!department) return res.status(404).json({ message: "Department not found" });
        res.json(department);
    } catch (error) {
        console.error("Error in getDepartmentById:", error);
        res.status(500).json({ message: error.message });
    }
};


// ✅ Update Department
const updateDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!department) return res.status(404).json({ message: "Department not found" });
        res.json(department);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Delete Department
const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        if (!department) return res.status(404).json({ message: "Department not found" });
        res.json({ message: "Department deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
};
