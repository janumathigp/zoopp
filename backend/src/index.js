const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json())

mongoose.connect("mongodb+srv://janu:05nov2002@hyper-j.jnlfgci.mongodb.net/delivery?retryWrites=true&w=majority&appName=hyper-j");

mongoose.connection.on('connected',()=>{
    console.log("MongoDB connected");
})

mongoose.connection.on('error',()=>{
console.error(`Error:${err}`);
})

app.use("/api/orders", require("./routes/orders"));
app.use("/api/login", require("./routes/login"));

const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Server running on PORT : ${PORT}`);
})

