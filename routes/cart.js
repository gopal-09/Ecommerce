const express = require('express');
const cartrouter=express.Router();
const auth= require('../middleware/Auth');
const {addproduct,allItems,updateCart,deleteCart}=require('../controllers/cart')
cartrouter.post('/add',auth,addproduct)
cartrouter.get('/allitems',auth,allItems)
cartrouter.put('/update/:id',auth,updateCart)
cartrouter.delete('/delete/:id',auth,deleteCart)
module.exports =cartrouter