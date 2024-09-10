const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    customerName: String,
    items:[{
        name:String,
        quantity:Number,
        price:Number
    }],
    deliveryAddress:{
        firstLine: String,
        secondLine:String,
        city:String,
        pincode:Number
    },
    deliveryPartner: mongoose.Schema.Types.ObjectId,
    createdAt: {
        t: Number,
        i: Number
      }
})

module.exports = mongoose.model('Order',orderSchema);