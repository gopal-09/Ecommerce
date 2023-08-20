const express=require('express');
const prodrouter=express.Router();
const Admin = require('../middleware/Auth')
const auth= require('../middleware/Auth');
const {addproduct,allproducts,updateproduct,getproduct,deleteproduct,reviewproduct,getAllReviews,deletereview,FilterProducts,SearchProduct,elastic} = require('../controllers/product');
prodrouter.post('/add',Admin,addproduct);
prodrouter.get('/allproducts',allproducts)
prodrouter.put('/update/:id',Admin,updateproduct);
prodrouter.get('/get/:id',getproduct)
prodrouter.delete('/delete/:id',Admin,deleteproduct);
prodrouter.put('/review/:id',auth,reviewproduct);
prodrouter.get('/allreviews/:id',getAllReviews)
prodrouter.delete('/deletereview/:id',deletereview)
prodrouter.get('/filter',FilterProducts)
prodrouter.get('/search',elastic)
module.exports = prodrouter