const { validationResult} = require("express-validator");
const courseModel = require("../models/coursesModel");
const userModel = require('../models/userModel');
const httpMsg = require("../utils/httpMsg");
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');
const userRoles = require('../utils/userRoles');

const getAllCourses = asyncWrapper(async (req,res) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const courses = await courseModel.find({}, {"__v": false}).limit(limit).skip(skip);
    res.json({ status: httpMsg.SUCCESS, data: {courses}});
});

const getCourse = asyncWrapper(
    async (req, res, next) => {
        const course = await courseModel.findById(req.params.courseId, {"__v" : false});
        if(!course) {
            const error = appError.create('course not foundc', 404, httpMsg.FAIL)
            return next(error);
        }
        return res.json({ status: httpMsg.SUCCESS, data: {course}});
    }
);

const addCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpMsg.FAIL);
    return next(error);
  }

  if (req.user.role === userRoles.MANGER) {
    const teacherId = req.body.teacher;

    if (!teacherId) {
      return next(appError.create('You must provide a teacher ID', 400, httpMsg.FAIL));
    }

    const teacher = await userModel.findById(teacherId);

    if (!teacher || teacher.role !== userRoles.ADMIN) {
      return next(appError.create('Teacher not found or not an ADMIN', 400, httpMsg.FAIL));
    }
  }

  if (req.user.role === userRoles.ADMIN) {
    req.body.teacher = req.user._id;
  }

  req.body.createdBy = req.user._id;

  const newCourse = new courseModel(req.body);
  await newCourse.save();

  res.status(201).json({
    status: httpMsg.SUCCESS,
    data: { course: newCourse }
  });
});

const updateCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;

  const course = await courseModel.findById(courseId);
  if (!course) {
    return next(appError.create('Course not found', 404, httpMsg.FAIL));
  }

  if (req.user.role === userRoles.ADMIN && course.teacher.toString() !== req.user._id.toString()) {
    return next(appError.create('You are not allowed to update this course', 403, httpMsg.FAIL));
  }

  const updatedCourse = await courseModel.findByIdAndUpdate(courseId, { $set: req.body }, { new: true });

  return res.status(200).json({
    status: httpMsg.SUCCESS,
    data: { course: updatedCourse }
  });
});

const deleteCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;

  const course = await courseModel.findById(courseId);
  if (!course) {
    return next(appError.create('Course not found', 404, httpMsg.FAIL));
  }

  if (req.user.role === userRoles.ADMIN && course.teacher.toString() !== req.user._id.toString()) {
    return next(appError.create('You are not allowed to delete this course', 403, httpMsg.FAIL));
  }

  await courseModel.deleteOne({ _id: courseId });

  return res.status(200).json({
    status: httpMsg.SUCCESS,
    data: null
  });
});

const enrollInCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;
  const course = await courseModel.findById(courseId);
  if (!course) {
    return next(appError.create('Course not found', 404, httpMsg.FAIL));
  }

  const user = await userModel.findById(req.user._id);

  if (user.courses.includes(courseId)) {
    return next(appError.create('Already enrolled in this course', 400, httpMsg.FAIL));
  }

  if (course.students.includes(user._id)) {
    return next(appError.create('Already enrolled in this course (duplicate)', 400, httpMsg.FAIL));
  }

  user.courses.push(courseId);
  course.students.push(user._id);

  await user.save();
  await course.save();

  res.status(200).json({
    status: httpMsg.SUCCESS,
    message: 'Enrolled successfully'
  });
});

const unenrollFromCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;

  const course = await courseModel.findById(courseId);
  if (!course) {
    return next(appError.create('Course not found', 404, httpMsg.FAIL));
  }

  const user = await userModel.findById(req.user._id);

  if (!user.courses.includes(courseId)) {
    return next(appError.create('You are not enrolled in this course', 400, httpMsg.FAIL));
  }

  user.courses = user.courses.filter(id => id.toString() !== courseId);
  await user.save();

  course.students = course.students.filter(id => id.toString() !== user._id.toString());
  await course.save();

  res.status(200).json({
    status: httpMsg.SUCCESS,
    message: 'Unenrolled successfully'
  });
});

const getUserCourses = asyncWrapper(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate('courses', '-__v');
  res.status(200).json({
    status: httpMsg.SUCCESS,
    data: { courses: user.courses }
  });
});

const getTeacherCourses = asyncWrapper(async (req, res, next) => {
  const courses = await courseModel.find({ teacher: req.user._id }, '-__v');
  res.status(200).json({
    status: httpMsg.SUCCESS,
    data: { courses }
  });
});

const getUserCoursesByManager = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;

  const user = await userModel.findById(userId).populate({
    path: user.role === userRoles.USER ? 'courses' : '',
  });

  if (!user) {
    return next(appError.create('User not found', 404, httpMsg.FAIL));
  }

  if (user.role === userRoles.USER) {
    await user.populate('courses');
    return res.status(200).json({
      status: httpMsg.SUCCESS,
      data: { courses: user.courses }
    });
  }

  if (user.role === userRoles.ADMIN) {
    const courses = await courseModel.find({ teacher: userId });
    return res.status(200).json({
      status: httpMsg.SUCCESS,
      data: { courses }
    });
  }

  return res.status(400).json({
    status: httpMsg.FAIL,
    message: 'This user is neither a student nor a teacher'
  });
});

module.exports = {
    getAllCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    unenrollFromCourse,
    getUserCourses,
    getTeacherCourses,
    getUserCoursesByManager
}