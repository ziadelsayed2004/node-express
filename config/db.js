// config/db.js
const { MongoClient } = require("mongodb");

const url = "mongodb+srv://ziadelsayedzaki:1Qb1ixM5GSksswNn@mongo-db.eyyw3wb.mongodb.net/mongo-db?retryWrites=true&w=majority";
const client = new MongoClient(url);

let db;

async function connectToMongo() {
  try {
    await client.connect();
    console.log("✅ DB Connection Successful");
    db = client.db("mongo-db");
  } catch (err) {
    console.error("❌ DB Connection Failed:", err);
    throw err;
  }
}

function getDb() {
  if (!db) throw new Error("❌ DB not initialized. Call connectToMongo() first.");
  return db;
}

module.exports = { connectToMongo, getDb };
