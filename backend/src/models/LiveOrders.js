const mongoose = require('mongoose');

const liveOrdersSchema = new Schema({
    orderId : mongoose.Schema.Types.ObjectId,
    deliveryPersonId: mongoose.Schema.Types.ObjectId,
    status:String,
    timestamp: {
        t: Number,
        i: Number
      }
})

module.exports = mongoose.model('LiveOrders',liveOrdersSchema);