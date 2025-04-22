const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();

const uri = "mongodb+srv://AdminMongo:Admin1234@apis.gfw5aaa.mongodb.net/";
const client = new MongoClient(uri);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("stargames");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
connectDB();

app.use(cors());
app.use(express.json());

app.get("/games", async (req, res) => {
  try {
    const { title } = req.query;
    const { type } = req.query;
    let url = `https://gamerpower.com/api/giveaways?type=${type}`;
    if (title && title != "") {
      url = url + `&title=${title}`;
    }
    console.log(url);
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(
        "Network response was not ok" + JSON.stringify(await response.json())
      );

    let giveaways = await response.json();

    const games = giveaways.map((giveaway) => ({
      id: giveaway.id, //
      title: giveaway.title,
      imageUrl: giveaway.image || giveaway.thumbnail,
      genre: giveaway.type || "Unknown",
      platform: giveaway.platforms || "Multiple",
      releaseDate: giveaway.published_date || "Unknown",
      description: giveaway.description || "No description available",
    }));

    res.json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/games/:id", async (req, res) => {
  try {
    const response = await fetch(
      `https://gamerpower.com/api/giveaway?id=${req.params.id}`
    );
    if (!response.ok) throw new Error("Network response was not ok");

    const giveaway = await response.json();
    const game = {
      id: giveaway.id,
      title: giveaway.title,
      imageUrl: giveaway.image || giveaway.thumbnail,
      genre: giveaway.type || "Unknown",
      platform: giveaway.platforms || "Multiple",
      releaseDate: giveaway.published_date || "Unknown",
      description: giveaway.description || "No description available",
    };

    res.json(game);
  } catch (error) {
    console.error("Error fetching game details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/games/:id/reviews", async (req, res) => {
  try {
    const reviews = await db
      .collection("reviews")
      .find({ gameId: req.params.id })
      .sort({ date: -1 })
      .toArray();
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/games/:id/reviews", express.json(), async (req, res) => {
  try {
    const review = {
      gameId: req.params.id,
      author: req.body.author,
      rating: parseInt(req.body.rating),
      comment: req.body.comment,
      date: new Date(),
    };

    const result = await db.collection("reviews").insertOne(review);
    res.status(201).json({ ...review, _id: result.insertedId });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/reviews/:id", express.json(), async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { author, rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const result = await db.collection("reviews").updateOne(
      { _id: new ObjectId(reviewId) },
      {
        $set: {
          author: author,
          rating: parsedRating,
          comment: comment,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Reseña no encontrada" });
    }

    res.status(200).json({
      message: "Reseña actualizada exitosamente",
      updated: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error actualizando reseña:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.delete("/reviews/:id", async (req, res) => {
  try {
    const result = await db.collection("reviews").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
