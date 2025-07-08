const { body } = require('express-validator');

const validateCourseBody = [
  body('course')
    .trim()
    .notEmpty().withMessage('Course name is required')
    .isLength({ min: 2 }).withMessage('Course name must be at least 2 characters')
];

module.exports = {
  validateCourseBody
};
