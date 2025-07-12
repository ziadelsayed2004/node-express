const { mongoose } = require("../config/db");

const courseSchema = new mongoose.Schema({}, { strict: false });

const Course = mongoose.model("Course", courseSchema, "node");

module.exports = {
  getAll: async () => {
    return await Course.find();
  },

  getById: async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Course.findById(id);
  },

  create: async (course) => {
    const newCourse = new Course(course);
    return await newCourse.save();
  },

  update: async (id, updateData) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Course.findByIdAndUpdate(id, updateData, { new: true });
  },

  delete: async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Course.findByIdAndDelete(id);
  },
};