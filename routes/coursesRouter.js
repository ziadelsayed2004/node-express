const express = require('express');
const router = express.Router();
const courseController = require('../controllers/coursesController');
const { validationSchema } = require('../middlewares/validationSchema');
const verifyToken = require('../middlewares/verfiyToken');
const userRoles = require('../utils/userRoles');
const allowedTo = require('../middlewares/allowedTo');


router.route('/')
            .get(courseController.getAllCourses)
            .post(verifyToken, allowedTo(userRoles.MANGER), validationSchema(), courseController.addCourse);


router.route('/:courseId')
            .get(courseController.getCourse)
            .patch(courseController.updateCourse)
            .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), courseController.deleteCourse);


module.exports = router;