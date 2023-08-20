const { routeNotFound } = require("./middleware/routeNotFound");
const { errorHandler } = require("./middleware/ErrorHandler");
const { Client} = require('@elastic/elasticsearch');
const userrouter = require("./routes/user");
const orderrouter= require("./routes/order");
const prodrouter = require("./routes/product");
const cartrouter = require("./routes/cart");
const paymentRoute = require('./routes/paymentRoute');

const mongoose = require("mongoose");
const express= require('express')
const app = express()
// app.use(express.json());
app.use('/users',userrouter)
app.use('/admin',userrouter)
app.use('/orders',orderrouter)
app.use('/products',prodrouter);
app.use('/cart',cartrouter);
app.use('/',paymentRoute);

// app.use(routeNotFound);

//app.use(errorHandler);
require("dotenv").config()
mongoose.connect(process.env.Mongodb_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
   
app.listen(5000, () => {
    console.log(`Server listening on: http://localhost:5000/`);
  });

  