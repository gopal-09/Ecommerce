const express = require("express");
const orderrouter = express.Router();
const auth= require('../middleware/Auth');
const Admin = require('../middleware/Auth')
const {newOrder,getOrder,getAllOrder,updateOrder,Allorders,deleteOrder,payment}= require('../controllers/order')
orderrouter.post('/order/new',auth,newOrder)
orderrouter.get('/order/one/:id',auth,getOrder)
orderrouter.get('/order/all',auth,getAllOrderItems)
orderrouter.get('/order/allorders',Admin,Allorders)
orderrouter.put('/order/update/:id',Admin,updateOrder)
orderrouter.delete('/order/delete/:id',Admin,deleteOrder)
orderrouter.post('/payment',auth,payment)
module.exports= orderrouter