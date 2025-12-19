const express = require('express');
const router = express.Router();
const {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
} = require('../controllers/departmentController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

//Public routes
router.get('/', getDepartments);
router.get('/:id', getDepartmentById);

//Protected routes 
router.post('/', protect, adminOnly, createDepartment);
router.put('/:id', protect, adminOnly, updateDepartment);
router.delete('/:id', protect, adminOnly, deleteDepartment);

module.exports = router;