const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : String,
    userId:Number,
    totalOrders:Number
});

module.exports = mongoose.model('User',userSchema);