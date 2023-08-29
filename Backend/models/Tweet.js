const mongoose = require("mongoose");

// Define the Tweet schema
const tweetSchema = new mongoose.Schema(
  {
    content: { type: String, required: true }, // The content of the tweet
    tweetedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The user who tweeted the tweet
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // The users who liked the tweet
    retweetBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // The users who retweeted the tweet
    image: { type: String }, // The URL of an optional image associated with the tweet
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tweet" }], // The replies to the tweet
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps to the tweet
);

// Export the Tweet model
module.exports = mongoose.model("Tweet", tweetSchema);
