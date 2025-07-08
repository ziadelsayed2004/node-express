const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');

const coursesController = require('../controllers/coursesController');

const validateCourseBody = [
  body('course')
    .trim()
    .notEmpty().withMessage('Course name is required')
    .isLength({ min: 2 }).withMessage('Course name must be at least 2 characters')
];

router.route('/')
    .post(validateCourseBody, coursesController.createCourse)
    .get(coursesController.getAllCourses);

router.route('/:courseId')
    .get(coursesController.getCourse)
    .patch(validateCourseBody, coursesController.updateCourse)
    .delete(coursesController.deleteCourse);

module.exports = router;
