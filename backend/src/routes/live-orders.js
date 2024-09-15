const express = require('express');
const router = express.Router();
const LiveOrder = require("../models/LiveOrders");
const Order = require("../models/Order");


// Existing routes for adding orders and getting pending/delivered orders
router.post('/', async (req, res) => {
  const { orderId, deliveryPersonId } = req.body;

  try {
    const existingOrder = await Order.findOne({ orderID: orderId });

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found in the system" });
    }

    const newLiveOrder = new LiveOrder({ orderId, deliveryPersonId });
    await newLiveOrder.save();

    existingOrder.deliveryPersonId = deliveryPersonId;
    await existingOrder.save();

    return res.status(201).json({
      message: "Order added to live orders and updated in the main order collection",
      newLiveOrder,
      updatedOrder: existingOrder
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Adding order to live orders failed" });
  }
});

router.get('/pending', async (req, res) => {
  const { deliveryPersonId } = req.query;

  try {
    const query = { status: "pending" };

    if (deliveryPersonId) {
      query.deliveryPersonId = deliveryPersonId;
    }
    const pendingOrders = await LiveOrder.find(query);

    const orderDetails = await Promise.all(
      pendingOrders.map(async (liveOrder) => {
        const order = await Order.findOne({ orderID: liveOrder.orderId });
        return {
          ...liveOrder._doc,
          orderDetails: order,
        };
      })
    );
    return res.status(200).json(orderDetails);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

router.get('/delivered', async (req, res) => {
  const { deliveryPersonId } = req.query;

  try {
    const query = { status: "delivered" };

    if (deliveryPersonId) {
      query.deliveryPersonId = deliveryPersonId;
    }
    const deliveredOrders = await LiveOrder.find(query);

    const orderDetails = await Promise.all(
      deliveredOrders.map(async (liveOrder) => {
        const order = await Order.findOne({ orderID: liveOrder.orderId });
        return {
          ...liveOrder._doc,
          orderDetails: order,
        };
      })
    );
    return res.status(200).json(orderDetails);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
