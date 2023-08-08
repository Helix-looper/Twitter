const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Tweet = require("../models/Tweet");
const authenticateToken = require("./authenticateToken");
const fileUpload = require("../multerConfig");

router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID and populate the 'following' and 'followers' fields
    const user = await User.findById(userId)
      .populate('following', 'name username')
      .populate('followers', 'name username');

    if (user) {
        user.password = undefined;
      res.json(user);
    } else {
        // console.log(error);
        res.status(404).json({ error: 'User not found!' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch user data!' });
  }
});

router.put('/:id',authenticateToken, async (req, res) => {
    const loggedInUserId = req.user.id;
    const userId = req.params.id;
    const { name, dateOfBirth, location } = req.body;
  
    try {
        // Check if the logged-in user is trying to edit their own details
    if (loggedInUserId !== userId) {
        return res.status(403).json({ error: 'Cannot edit other user\'s details!' });
      }
        
      // Find the user by ID
      const user = await User.findById(userId);
  
      // Check if the user exists
      if (!user) {
        console.log(error);
        return res.status(404).json({ error: 'User not found!' });
      }
  
      // Update the allowed fields (name, dateOfBirth, location) from the request body
      user.name = name;
      user.dateOfBirth = dateOfBirth;
      user.location = location;
  
      // Save the edited user in the database
      await user.save();
  
      res.json({ message: 'User updated successfully!' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to update user!' });
    }
});

router.post('/:id/follow', authenticateToken, async (req, res) => {
    const loggedInUserId = req.user.id;
    const userToFollowId = req.params.id;
  
    try {
        if (loggedInUserId === userToFollowId) {
            return res.status(400).json({ error: 'Cannot follow yourself!' });
          }

      // Find the logged-in user and the user to follow
      const loggedInUser = await User.findById(loggedInUserId);
      const userToFollow = await User.findById(userToFollowId);
  
      // Add the user to follow ID to the following array of the logged-in user
      loggedInUser.following.push(userToFollowId);
  
      // Add the logged-in user ID to the followers array of the user to follow
      userToFollow.followers.push(loggedInUserId);
  
      // Save both users
      await loggedInUser.save();
      await userToFollow.save();
  
      res.json({ message: 'Successfully followed user!' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to follow user!' });
    }
});

router.post('/:id/unfollow',authenticateToken, async (req, res) => {
    const loggedInUserId = req.user.id;
    const userToUnfollowId = req.params.id;
  
    try {
        if (loggedInUserId === userToUnfollowId) {
            return res.status(400).json({ error: 'Cannot unfollow yourself!' });
          }

      // Find the logged-in user and the user to unfollow
      const loggedInUser = await User.findById(loggedInUserId);
      const userToUnfollow = await User.findById(userToUnfollowId);

      // Check if the logged-in user is not following the user to unfollow
    if (!loggedInUser.following.includes(userToUnfollowId)) {
        return res.status(400).json({ error: 'Not following this user!' });
      }
  
      // Remove the user to unfollow ID from the following array of the logged-in user
      loggedInUser.following.pull(userToUnfollowId);
  
      // Remove the logged-in user ID from the followers array of the user to unfollow
      userToUnfollow.followers.pull(loggedInUserId);
  
      // Save both users
      await loggedInUser.save();
      await userToUnfollow.save();
  
      res.json({ message: 'Successfully unfollowed user!' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to unfollow user!' });
    }
});

router.get('/:id/tweets', async (req, res) => {
    const userId = req.params.id;
  
    try {
      // Find all tweets by the user ID
      const tweets = await Tweet.find({ userId });
  
      res.json(tweets);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to retrieve tweets!' });
    }
});

router.post('/:id/uploadProfilePic', fileUpload("images/profile-images").single("profile-image"), async (req, res) => {
    const userId = req.params.id;
    const profilePicPath = req.file?.path;
  
    try {
      // Find the user by ID
      const user = await User.findById(userId);
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found!' });
      }
  
      // Update the user's profilePic field with the stored image location
      user.profilePic = profilePicPath;
  
      // Save the user in the database
      await user.save();
  
      res.json({ message: 'Profile picture uploaded successfully!' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to upload profile picture!' });
    }
});

module.exports = router;
