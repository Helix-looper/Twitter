// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Create Express app
const app = express();
const port = 5000;

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());

const url = "mongodb://127.0.0.1:27017/Twitter";

app.use("/images", express.static(path.join(__dirname, "images")));
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const tweetRoute = require("./routes/tweets");

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/tweet", tweetRoute);

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
