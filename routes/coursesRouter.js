const express = require('express');
const router = express.Router();
const courseController = require('../controllers/coursesController');
const { validationSchema } = require('../middlewares/validationSchema');
const verifyToken = require('../middlewares/verfiyToken');
const userRoles = require('../utils/userRoles');
const allowedTo = require('../middlewares/allowedTo');

router.post('/enroll/:courseId', verifyToken, allowedTo(userRoles.USER), courseController.enrollInCourse);
router.delete('/unenroll/:courseId', verifyToken, allowedTo(userRoles.USER), courseController.unenrollFromCourse);

router.get('/my-courses', verifyToken, allowedTo(userRoles.USER), courseController.getUserCourses);
router.get('/my-teaching-courses', verifyToken, allowedTo(userRoles.ADMIN), courseController.getTeacherCourses);
router.get('/users-courses/:userId', verifyToken, allowedTo(userRoles.MANGER), courseController.getUserCoursesByManager);

router.route('/')
  .get(courseController.getAllCourses)
  .post(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), validationSchema(), courseController.addCourse);

router.route('/:courseId')
  .get(courseController.getCourse)
  .patch(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), courseController.updateCourse)
  .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), courseController.deleteCourse);

module.exports = router;