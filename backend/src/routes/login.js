const express = require('express');
const router = express.Router();
const User = require("../models/User");

router.post('/', async (req, res) => {
  const { userID, password } = req.body;

  if (!userID || !password) {
    return res.status(400).json({ success: false, message: 'User ID and Password are required' });
  }

  try {
    const user = await User.findOne({ userID, password });

    if (user) {
      return res.status(200).json({ success: true, message: 'Login successful', user });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid User ID or Password' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
