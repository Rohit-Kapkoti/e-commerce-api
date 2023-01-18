const express = require('express');
const app =express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
dotenv.config();


mongoose
.connect(process.env.MONGO_URL)
.then(()=> console.log("DBconnection is succesful"))
.catch((err) =>{
    console.log(err);
});


app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts",cartRoute);
app.use("/api/orders",orderRoute);



app.listen(8080, ()=>{
    console.log(`server is running on ${process.env.PORT}`);
})