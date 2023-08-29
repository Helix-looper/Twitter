const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

router.post("/register", async (req, res) => {
  const { name, username, email, password } = req.body;

  // Validate if all fields are sent
  if (!name || !username || !email || !password) {
    console.log(error);
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const encryptPassword = await bcrypt.hash(password, 16);

    // Create a new user
    const newUser = new User({
      name,
      username,
      email,
      password: encryptPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to register user!" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ email: email });

    if (user) {
      // Compare the password with the hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET);

        user.password = undefined;
        // Send the token in the response body
        res.json({ message: "Login successfull", user, token }); // Response body approach
      } else {
        res.status(500).json({ error: "Invalid username or password!" });
      }
    } else {
      res.status(500).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to login user!" });
  }
});

module.exports = router;
