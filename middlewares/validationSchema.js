const { body } = require('express-validator');

const validateCourseBody = [
  body('course')
    .exists({ checkFalsy: true }).withMessage('Course name is required')
    .isString().withMessage('Course name must be a string')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Course name must be between 2 and 100 characters')
];

module.exports = {
  validateCourseBody
};