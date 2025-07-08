const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');

const coursesController = require('../controllers/coursesController');

// Validation middleware
const validateCourseBody = [
  body('course')
    .trim()
    .notEmpty().withMessage('Course name is required')
    .isLength({ min: 2 }).withMessage('Course name must be at least 2 characters')
];

// GET all
router.get('/', coursesController.getAllCourses);

// GET by ID
router.get('/:courseId', coursesController.getCourse);

// POST
router.post('/', validateCourseBody, coursesController.createCourse);

// PATCH
router.patch('/:courseId', validateCourseBody, coursesController.updateCourse);

// DELETE
router.delete('/:courseId', coursesController.deleteCourse);

module.exports = router;
