const express = require('express');
const router = express.Router();
const LiveOrder = require("../models/LiveOrders");
const Order = require("../models/Order");
const User = require("../models/User");

// Add a new endpoint to update the status of an order to "delivered"
router.post('/', async (req, res) => {

  try {
    console.log("Request body:", req.body);
    const { orderId, deliveryPersonId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const liveOrder = await LiveOrder.findOne({ orderId });

    if (!liveOrder) {
      return res.status(404).json({ message: "Pending live order not found" });
    }

    liveOrder.status = "delivered";
    await liveOrder.save();

    const existingOrder = await Order.findOne({ orderID: orderId });

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found in the main order collection" });
    }

    existingOrder.status = "delivered";
    await existingOrder.save();

    const user = await User.findOne({ userID: deliveryPersonId });
    if (!user) {
      return res.status(404).json({ message: "Delivery Person not found in the main user collection" });
    }

    user.totalOrders = user.totalOrders + 1;
    await user.save();

    return res.status(200).json({
      message: "Order status updated to delivered",
      liveOrder,
      updatedOrder: existingOrder
    });
  } catch (err) {
    console.error("Error updating status:", err);
    return res.status(500).json({ message: "Updating order status failed" });
  }
  
});

module.exports = router;
