const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // The name of the user
    username: { type: String, required: true, unique: true }, // The username of the user (must be unique)
    email: { type: String, required: true, unique: true }, // The email of the user (must be unique)
    password: { type: String, required: true }, // The password of the user
    profilePicture: { type: String }, // The URL of the user's profile picture
    location: { type: String }, // The location of the user
    dateOfBirth: { type: String }, // The date of birth of the user
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // The users who follow the user
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // The users who the user is following
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps to the user
  }
);

// Export the User model
module.exports = mongoose.model("User", userSchema);
