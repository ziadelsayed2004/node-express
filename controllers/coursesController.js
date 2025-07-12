const { validationResult } = require("express-validator");
const courseModel = require("../models/coursesModel");
const httpMsg = require("../utils/httpMsg");

const getAllCourses = async (req, res) => {
  const courses = await courseModel.getAll();
  res.json({status:httpMsg.success, courses});
};

const getCourse = async (req, res) => {
  try{const course = await courseModel.getById(req.params.courseId);
    if (!course) return res.status(404).json({status:httpMsg.notFound, msg: "Not Found" });
    return res.json({status:httpMsg.success, course});
  } catch(err) {
    return res.status(400).json(({status:httpMsg.notFound, msg: "ID Not Found" }));
  }
};

const createCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const newCourse = await courseModel.create(req.body);
    res.status(201).json({status:httpMsg.success, newCourse});
  } catch (err) {
    console.error("❌ Error creating course:", err);
    res.status(500).json({status:httpMsg.fail,  msg: "Internal Server Error" });
  }
};

const updateCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const course = await courseModel.getById(req.params.courseId);
  if (!course) return res.status(404).json({status:httpMsg.notFound, msg: "Not Found" });

  await courseModel.update(req.params.courseId, req.body);
  const updatedCourse = await courseModel.getById(req.params.courseId);
  res.json({status:httpMsg.success, updatedCourse});
};

const deleteCourse = async (req, res) => {
  const course = await courseModel.getById(req.params.courseId);
  if (!course) return res.status(404).json({status:httpMsg.notFound, msg: "Not Found" });

  await courseModel.delete(req.params.courseId);
  res.json({status:httpMsg.deleted,  msg: "Deleted", deleted: course });
};

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
};
