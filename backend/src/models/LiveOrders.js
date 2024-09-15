const mongoose = require('mongoose');

const liveOrdersSchema = new mongoose.Schema({
    orderId : {
      type:Number,
      required:true,
    },
    deliveryPersonId: {
      type:Number,
      required:true,
    },
    status:{
      type:String,
      default:"pending",
    },
    timestamp: {
      type: Date,
      default: Date.now,  // Set default to current date and time
    }
})

module.exports = mongoose.model('LiveOrders',liveOrdersSchema);