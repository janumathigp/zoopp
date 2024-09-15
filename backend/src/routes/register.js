const express = require('express');
const router = express.Router();
const User = require("../models/User");


router.post('/', async (req, res) => {
  const { name,userID, password } = req.body;
  const totalOrders = 0;
  try {
    const newUser = new User({ name,userID, password,totalOrders });
    await newUser.save();
    return res.status(201).json({ success: true, message: "User registered successfully" })
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
})

module.exports = router;
