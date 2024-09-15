const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());

mongoose.connect("mongodb+srv://janu:05nov2002@hyper-j.jnlfgci.mongodb.net/delivery?retryWrites=true&w=majority&appName=hyper-j");

mongoose.connection.on('connected',()=>{
    console.log("MongoDB connected");
})

mongoose.connection.on('error',()=>{
console.error(`Error`);
})

app.use(bodyParser.json());


app.use("/api/live-orders", require("./routes/live-orders"));
app.use("/api/login", require("./routes/login"));
app.use("/api/register",require("./routes/register"));
app.use("/api/orders",require("./routes/orders"));
app.use("/api/update-status", require("./routes/update-status"));


const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Server running on PORT : ${PORT}`);
})

