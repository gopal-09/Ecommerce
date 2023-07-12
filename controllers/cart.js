const Product = require('../models/product');
const Cart = require('../models/cart');
const  httpResponse  = require("../helpers/helper")
const CustomError = require("../errors");
const { findOneAndDelete } = require('../models/order');
addproduct=async(req,res,next) => {
    const {productId,quantity} = req.body
    try{
    const product = await Product.findById({_id:productId})
    if(!product) {
        return next(new CustomError.NotFoundError("product not found"));}
        const cart = new Cart({
            product:productId, 
            quantity:quantity
         } )
        await cart.save()
        return res
      .status(200)
      .json(httpResponse(true, "product add to cart successfully",cart));
    }catch(err){
        return  res
        .status(500)
        .json(httpResponse(false, "cart retreive failed",err.message));
      }

}
allItems=async(req,res,next)=>{
    try{
        const items=await Cart.find();
        return res
      .status(200)
      .json(httpResponse(true, "cart details",items));
    }
    catch(err){
        return  res
        .status(500)
        .json(httpResponse(false, "product retreive failed",err.message));
      }
}
updateCart=async(req,res,next)=>{
    try{
         const items=await Cart.findOneAndUpdate({product:req.params.id},
          {
            $set:req.body
          },
          {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          })
          return res
      .status(200)
      .json(httpResponse(true, "product details",items));
    }catch(err){
    return  res
    .status(500)
    .json(httpResponse(false, "cart updation failed",err.message));
  }
}
deleteCart=async(req, res, next)=>{
    try{
      const items=await Cart.findOneAndDelete({product:req.params.id})
      return res
      .status(200)
      .json(httpResponse(true, "cart deleted",{}));
    }catch(err){
    return  res
    .status(500)
    .json(httpResponse(false, "cart deletion failed",err.message));
  }
}
module.exports ={addproduct,allItems,updateCart,deleteCart}