const { validationResult } = require('express-validator');
const { courses } = require('../models/coursesModel');

const getAllCourses = (req, res) => {
  res.json(courses);
};

const getCourse = (req, res) => {
  const courseId = +req.params.courseId;
  const course = courses.find(c => c.id === courseId);
  if (!course) return res.status(404).json({ msg: "Not Found" });
  res.status(200).json(course);
};

const createCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newCourse = { id: courses.length + 1, ...req.body };
  await courses.push(newCourse); // 🟢 استخدم proxy push
  res.status(201).json(courses);
};

const updateCourse = (req, res) => {
  const courseId = +req.params.courseId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let course = courses.find(c => c.id === courseId);
  if (!course) return res.status(404).json({ msg: "Not Found" });

  course = { ...course, ...req.body };
  courses[courses.findIndex(c => c.id === courseId)] = course;
  res.status(200).json(course);
};

const deleteCourse = (req, res) => {
  const courseId = +req.params.courseId;
  const index = courses.findIndex(c => c.id === courseId);
  if (index === -1) return res.status(404).json({ msg: "Not Found" });

  courses.splice(index, 1);
  res.status(200).json(courses);
};

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
};
