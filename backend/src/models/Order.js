const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    orderID:Number,
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
        pincode:Number,
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    deliveryPersonId: {
        type:Number,
        default:null
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
    phone:Number,
    status:{
        type:String,
        default:"pending"
    }
})

module.exports = mongoose.model('Order',orderSchema);