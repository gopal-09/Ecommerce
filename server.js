const { routeNotFound } = require("./middleware/routeNotFound");
const { errorHandler } = require("./middleware/ErrorHandler");
const multer=require('multer')
const path = require('path');
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const { Client} = require('@elastic/elasticsearch');
const userrouter = require("./routes/user");
const orderrouter= require("./routes/order");
const prodrouter = require("./routes/product");
const cartrouter = require("./routes/cart");
const paymentRoute = require('./routes/paymentRoute');
const upload= require('./middleware/upload');
const {uploadFile,getFileStream} = require('./s3')
const mongoose = require("mongoose");
const express= require('express')
const app = express()
app.use(express.json());
app.use('/users',userrouter)
app.use('/admin',userrouter)
app.use('/orders',orderrouter)
app.use('/products',prodrouter);
app.use('/cart',cartrouter);
app.use('/',paymentRoute);
app.post('/upload',upload,async(req,res) =>{
  const file = req.file
  console.log(file)
const result = await uploadFile(file)
  await unlinkFile(file.path)
  console.log(result)
  const description = req.body.description
  res.send({imagePath: `/images/${result.Key}`})
})
app.get('/images/:key', (req, res) => {
  console.log(req.params)
  const key = req.params.key
  const readStream = getFileStream(key)

  readStream.pipe(res)
})
app.use(routeNotFound);
app.use(errorHandler);
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
   
app.listen(9201, () => {
    console.log(`Server listening on: http://localhost:5000/`);
  });

  