const { getDb } = require("../config/db");
const { ObjectId } = require("mongodb");

const collectionName = "node";
let courses = [];

const initCourses = async () => {
  const db = getDb();
  courses = await db.collection(collectionName).find().toArray();
};

const handler = {
  get(target, prop) {
    if (prop === "push") {
      return async function (course) {
        const db = getDb();
        const result = await db.collection(collectionName).insertOne(course);
        course._id = result.insertedId;
        target.push(course);
      };
    }

    if (prop === "filter") return (...args) => target.filter(...args);
    if (prop === "find") return (...args) => target.find(...args);
    if (prop === "map") return (...args) => target.map(...args);
    if (prop === "length") return target.length;

    return target[prop];
  },

  set(target, prop, value) {
    target[prop] = value;
    return true;
  }
};

const coursesProxy = new Proxy(courses, handler);

module.exports = {
  courses: coursesProxy,
  initCourses
};
