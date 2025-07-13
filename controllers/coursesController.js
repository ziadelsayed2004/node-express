const { validationResult } = require("express-validator");
const courseModel = require("../models/coursesModel");
const httpMsg = require("../utils/httpMsg");

const getAllCourses = async (req, res) => {
  try {
    const courses = await courseModel.getAll();
    return res.json({status:httpMsg.success, courses});
  } catch(err) {
    return res.json({status:httpMsg.fail, errors: err.array()});
  }
};

const getCourse = async (req, res) => {
  try{const course = await courseModel.getById(req.params.courseId);
    if (!course) return res.status(404).json({status:httpMsg.notFound, msg:"Not Found"});
    return res.json({status:httpMsg.success, course});
  } catch(err) {
    return res.status(400).json(({status:httpMsg.notFound, msg:"ID Not Found", errors: err.array()}));
  }
};

const createCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({status:httpMsg.fail ,errors: errors.array()});
  try {
    const newCourse = await courseModel.create(req.body);
    res.status(201).json({status:httpMsg.success, newCourse});
  } catch (err) {
    res.status(500).json({status:httpMsg.fail, msg: "Internal Server Error", errors:err.array()});
  }
};

const updateCourse = async (req, res) => {
  const errors = validationResult(req);
  const course = await courseModel.getById(req.params.courseId);
  if (!errors.isEmpty()) return res.status(400).json({status:httpMsg.fail, errors: errors.array()});
  if (!course) return res.status(404).json({status:httpMsg.notFound, msg: "Not Found" });
  try{
    await courseModel.update(req.params.courseId, req.body);
    const updatedCourse = await courseModel.getById(req.params.courseId);
    res.json({status:httpMsg.success, updatedCourse});
  } catch(err){
    res.status(500).json({status:httpMsg.fail, msg: "Internal Server Error", errors:err.array()});
  }
};

const deleteCourse = async (req, res) => {
  const course = await courseModel.getById(req.params.courseId);
  if (!course) return res.status(404).json({status:httpMsg.notFound, msg: "Not Found" });
  try{
    await courseModel.delete(req.params.courseId);
    res.json({status:httpMsg.deleted,  msg: "Deleted", deleted: course });
  } catch(err){
    res.status(500).json({status:httpMsg.fail, msg: "Internal Server Error", errors:err.array()});
  }
};

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
};