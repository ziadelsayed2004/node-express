const { validationResult } = require('express-validator');
let courses = require('../models/coursesModel');

const getAllCourses = (req, res) => {
  res.json(courses);
};

const getCourse = (req, res) => {
  const courseId = +req.params.courseId;
  const course = courses.find(c => c.id === courseId);
  if (!course) return res.status(404).json({ msg: "Not Found" });
  res.status(200).json(course);
};

const createCourse = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newCourse = { id: courses.length + 1, ...req.body };
  courses.push(newCourse);
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
  courses = courses.map(c => (c.id === courseId ? course : c));
  res.status(200).json(course);
};

const deleteCourse = (req, res) => {
  const courseId = +req.params.courseId;
  const course = courses.find(c => c.id === courseId);
  if (!course) return res.status(404).json({ msg: "Not Found" });
  courses = courses.filter(c => c.id !== courseId);
  res.status(200).json(courses);
};

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
};
