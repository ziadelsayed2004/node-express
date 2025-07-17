const mongoose = require("mongoose");

const url = process.env.MONGO_URL;

async function connectToMongo() {
  try {
    await mongoose.connect(url, {
      dbName: "mongo-db"
    });
    console.log("✅ Mongoose connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ Mongoose connection failed:", err);
    throw err;
  }
}

module.exports = { connectToMongo ,  mongoose };
