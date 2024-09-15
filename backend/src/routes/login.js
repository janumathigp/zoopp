const express = require('express');
const router = express.Router();
const User = require("../models/User");


router.post('/reg', async (req, res) => {
  const { userID, password } = req.body;

  try {
    const newUser = new User({ userID, password });
    await newUser.save();

    return res.status(201).json({ success: true, message: "User registered successfully" })
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }

})
router.post('/', (req, res) => {
  const { userID, password } = req.body;

  // Simple validation
  if (!userID || !password) {
    return res.status(400).json({ success: false, message: 'User ID and Password are required' });
  }

  // Check if the user exists
  const user = users.find((u) => u.userID === userID && u.password === password);

  if (user) {
    // If user is found, send success response
    return res.status(200).json({ success: true, message: 'Login successful', user });
  } else {
    // If user is not found, send error response
    return res.status(401).json({ success: false, message: 'Invalid User ID or Password' });
  }
});

module.exports = router;
