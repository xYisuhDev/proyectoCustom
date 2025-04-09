const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { json } = require("stream/consumers");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const e = require("express");
const { get } = require("http");
const client = new MongoClient(
  "mongodb+srv://AdminMongo:Admin1234@apis.gfw5aaa.mongodb.net/?retryWrites=true&w=majority&appName=APIs"
);

async function getCollectionGames() {
  await client.connect();
  const db = client.db("stargames");
  const collection = db.collection("games");
  return collection;
}

async function getCollectionReviews() {
  await client.connect();
  const db = client.db("stargames");
  const collection = db.collection("reviews");
  return collection;
}

app.use(cors());
app.use(express.json());

app.get("/games", async (req, res) => {
  try {
    const collection = await getCollectionGames();

    if (req.query.title == null) {
      const games = await collection.find({}).toArray();
      res.json(games);
      return;
    } else {
      const games = await collection
        .find({ title: { $regex: req.query.title, $options: "i" } })
        .toArray();
      res.json(games);
    }
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
