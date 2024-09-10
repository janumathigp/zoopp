const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : String,
    totalOrders:Number
});

module.exports = mongoose.model('User',userSchema);