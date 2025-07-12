const mongoose = require("mongoose");

const url = "mongodb+srv://ziadelsayedzaki:1Qb1ixM5GSksswNn@mongo-db.eyyw3wb.mongodb.net/mongo-db?retryWrites=true&w=majority";

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
