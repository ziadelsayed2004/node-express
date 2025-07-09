const { getDb } = require("../config/db");
const { ObjectId } = require("mongodb");

const collectionName = "node";

module.exports = {
  getAll: async () => {
    const db = getDb();
    return await db.collection(collectionName).find().toArray();
  },

  getById: async (id) => {
    const db = getDb();
    return await db.collection(collectionName).findOne({ id: +id });
  },

  create: async (course) => {
    const db = getDb();
    return await db.collection(collectionName).insertOne(course);
  },

  update: async (id, updateData) => {
    const db = getDb();
    return await db.collection(collectionName).updateOne(
      { id: +id },
      { $set: updateData }
    );
  },

  delete: async (id) => {
    const db = getDb();
    return await db.collection(collectionName).deleteOne({ id: +id });
  }
};
