const express = require('express');
const router = express.Router();

const coursesController = require('../controllers/coursesController');
const { validateCourseBody } = require('../middlewares/validationSchema');

router.route('/')
  .post(validateCourseBody, coursesController.createCourse)
  .get(coursesController.getAllCourses);

router.route('/:courseId')
  .get(coursesController.getCourse)
  .patch(validateCourseBody, coursesController.updateCourse)
  .delete(coursesController.deleteCourse);

module.exports = router;
