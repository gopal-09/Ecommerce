const Order = require("../models/order");
const Product = require('../models/product');
const  httpResponse  = require("../helpers/helper")
const CustomError = require("../errors");
newOrder=async(req, res, next)=>{
    try{
      let Price=0;
      const shippingPrice=5;
      let items=req.body.orderItems
      items.forEach(item => {Price=Price+(item.quantity)*(item.price)
        });
      const taxPrice=0.1*Price;
      const Total=taxPrice+Price+shippingPrice;
    const order = new Order({
        shippingInfo:req.body.shippingInfo,
        orderItems:req.body.orderItems,
        paymentInfo:req.body.paymentInfo,
        totalPrice:Total,
        paidAt: Date.now(),
        user: req.user._id,
      });
      await order.save();
      return res
      .status(200)
      .json(httpResponse(true, "order details",order));}
      catch(err){
    return 
    res.status(500)
    .json(httpResponse(false, "order  creation  failed",err.message));}
}
getOrder=async(req, res, next)=>{
    try{
    const order= await Order.findOne({_id:req.params.id})
    if (!order) {
        return next(new CustomError.NotFoundError("order not found"));
      }
      return res
      .status(200)
      .json(httpResponse(true, "order details",order))}
      catch(err){
        return  res
        .status(500)
        .json(httpResponse(false, "order  retreive failed",err.message));}


}
getAllOrderItems=async(req, res, next) => {
    try{
    const orders = await Order.find({ user: req.user._id });
    if (!orders) {
        return next(new CustomError.NotFoundError("orders not found"));}
  let ItemsOrdered= []
  for(let order of orders) {
    for(let item of order.orderItems){
        ItemsOrdered.push(item);
    }
  }
  return res
      .status(200)
      .json(httpResponse(true, "orderItems details",ItemsOrdered))
}
catch(err){
    return  res
    .status(500)
    .json(httpResponse(false, "Items retreive failed",err.message));}

}
Allorders=async(req, res, next)=>{
  try{
    const orders = await Order.find();
 
  let totalAmount = 0;
 
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  return res
  .status(200)
  .json(httpResponse(true, "orderItems details",{orders, totalAmount}))
  }
  catch (err) {
    return res.status(500).json(httpResponse(false, "order retreive failed", err.message));
  }
}
updateOrder=async(req,res,next) => {
  try{
  const order = await Order.findById(req.params.id);
  // console.log(order);
  if (!order) {
    return next(new CustomError.NotFoundError("order not found"))
  }
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  if (order.orderStatus === "Delivered") {
    return next(new CustomError.BadRequestError("order was already delivered"))
  }

  if (order.orderStatus === "Shipped") {
    order.orderItems.forEach( (item) => {
      //console.log(item)
       updateStock(item.id, item.quantity);
    });
  }
  //order.orderStatus = req.body.status;

  // if (req.body.status === "Delivered") {
  //   order.deliveredAt = Date.now();
  // }

  // const changedOrder=await Order.findById(req.params.id)
  // console.log(changedOrder);
  // await order.save({ validateBeforeSave: false });
  // res.header("Access-Control-Allow-Credentials",true)
  // res.status(200).json({
  //   success: true,
  //   changedOrder//added extra by dino
  // });
  // console.log(res);


async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  //console.log(product);
  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });

}
return res
  .status(200)
  .json(httpResponse(true, "order updated",{order}))
  }
  catch (err) {
    return res.status(500).json(httpResponse(false, "order update  failed", err.message));
  }
}
deleteOrder=async(req,res,next)=>{
try{
    const order=Order.findById(req.params.id)
    if(!order)
    return next(new CustomError.NotFoundError("order not found"))
    const order1 = await Order.findByIdAndRemove(req.params.id)
    return res
  .status(200)
  .json(httpResponse(true, "order deleted success",{}))
}catch (err) {
    return res.status(500).json(httpResponse(false, "order deletion failed", err.message));
  }

}
module.exports={newOrder,getOrder,getAllOrderItems,Allorders,updateOrder,deleteOrder};