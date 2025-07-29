const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Sequelize to use SQLite (file-based)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

// Define Profile model
const Profile = sequelize.define("Profile", {
  name: { type: DataTypes.STRING },
  url: { type: DataTypes.STRING },
  about: { type: DataTypes.TEXT },
  bio: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  followerCount: { type: DataTypes.STRING },
  connectionCount: { type: DataTypes.STRING },
  bioLine: { type: DataTypes.TEXT },
});

// Sync database
sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch(console.error);

// POST API to receive profile data
app.post("/api/profiles", async (req, res) => {
  try {
    const profile = await Profile.create(req.body);
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
