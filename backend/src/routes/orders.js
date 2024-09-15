const express = require('express');
const router = express.Router();
const Order = require("../models/Order"); // Import the Order model

router.post("/", async (req, res) => {
  const {
    orderID,
    customerName,
    items,
    deliveryAddress,
    deliveryPersonId,
    createdAt, phone
  } = req.body;

  try {
    const newOrder = new Order({
      orderID,
      customerName,
      items,
      deliveryAddress,
      deliveryPersonId,
      createdAt,
      phone
    });

    await newOrder.save();

    // Send success response
    return res.status(201).json({ success: true, message: "Order created successfully", newOrder });
  } catch (err) {
    // Handle any errors
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
