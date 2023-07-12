const Product = require('../models/product');
const  httpResponse = require("../helpers/helper")
const CustomError = require("../errors");
addproduct=async(req,res,next)=>{
    const data = req.body;
    id=req.product
    //console.log(req.product)
    try {
        const product = new Product({
          name: data.name,
          description: data.description,
          images: data.imagesLinks,
          price: data.price,
          Stock: data.Stock,
          category: data.category,
          product: id
        });
        await product.save();
return res.status(200).json(httpResponse(true, "product created",product));
      } catch(err){
        return  res
        .status(500)
        .json(httpResponse(false, "product creation failed",err.message));
      }
}
allproducts=async(req,res,next)=>{
  itemsPerPage=9;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * itemsPerPage
  try {
    const product = await Product.find().skip(skip).limit(itemsPerPage);
    return res.status(200).json(httpResponse(true, "products",product));
  }
  catch(err){
    return  res
    .status(500)
    .json(httpResponse(false, "product info failed",err.message));}
}
updateproduct=async(req,res,next) => {
  try{
    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        $set:req.body
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    if (!product) {
      return next(new CustomError.NotFoundError("product not found"));
    }
    return  res
    .status(200)
    .json(httpResponse(true, "product updated",product));
  }
  catch(err) {
    return  res
    .status(500)
    .json(httpResponse(false, "update failed",err.message));
  }
 }
 getproduct=async(req, res, next)=>{
  try{
    const product = await Product.findById({_id:req.params.id})
    if (!product) {
      return next(new CustomError.NotFoundError("product not found"));}
    return res
      .status(200)
      .json(httpResponse(true, "product details",product));
  
  }
  catch(err){
    return  res
    .status(500)
    .json(httpResponse(false, "product retreive failed",err.message));
  }
 }
 deleteproduct=async(req,res,next)=>{
  try{
    const product = await Product.deleteOne({_id:req.params.id});
      
          return res.status(StatusCodes.NO_CONTENT)
          .json(httpResponse(true, "product deleted", {}));}
          catch(err) {
            return  res
            .status(500)
            .json(httpResponse(false, "product deletion failed",err.message));
          }

 }
  reviewproduct = async (req, res, next) => {
  try {
    const { user, name, rating, comment } = req.body;
     console.log(user);
    const product = await Product.findById(req.params.id);

    const isReviewed = product.reviews.find((rev) => rev.user === req.user._id);

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user === req.user._id) {
          rev.name = name;
          rev.rating = rating;
          rev.comment = comment;
        }
      });
    } else {
      const review = {
        user: user,
        name: name,
        rating: rating,
        comment: comment,
      };

      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
      console.log(product.reviews);
    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    //await product.populate('reviews.user','user')
    // console.log(product)
    await product.save({ validateBeforeSave: false });

    return res.status(200).json(httpResponse(true, "Product details", product));
  } catch (err) {
    return res.status(500).json(httpResponse(false, "Product review failed", err.message));
  }
};
getAllReviews=async(req,res,next)=>{
  try{
  const product=await Product.findById(req.params.id)
  if(!product)
  return next(new CustomError.NotFoundError("product not found"))
  return res.status(200).json(httpResponse(true, "Product review details", product.reviews));
  }catch (err) {
    return res.status(500).json(httpResponse(false, "Product retreive failed", err.message));
  }
}
deletereview=async(req,res,next)=>{
  try{
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new CustomError.NotFoundError("product not found"))
  }
  const reviews = product.reviews.filter(
    (rev) =>{
      //console.log(rev.user.toString())
      console.log(req.user)
       rev.user.toString()!=req.user
    }
  );
  //console.log(reviews)
  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.params.id,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  const allProducts=await Product.find()
  return res.status(200).json(httpResponse(true, "Reviews deleted successfully", allProducts));}
  catch (err) {
    return res.status(500).json(httpResponse(false, "Review deletion failed", err.message));
  }
}
FilterProducts=async(req, res, next)=>{
  const category = req.query.category
  const mi=parseFloat(req.query.min)
  const ma=parseFloat(req.query.max)
  const rating = parseFloat(req.query.ratings)
  console.log(rating)
  try{
    const products = await Product.aggregate([
      {
        $match: { category: category,ratings:rating, price: { $gte: mi, $lt: ma } }
      }
    ]);
    if(products.length==0)
    return res.status(200).json(httpResponse(true, "no matches found",{}))
    return res.status(200).json(httpResponse(true, "filtered successfully", products))
  }catch (err) {
    return res.status(500).json(httpResponse(false, "filter failed", err.message));
  }
}
SearchProduct=async(req, res, next)=>{
  const search=req.query.search;
  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    });
    if (!products) {
      return next(new CustomError.NotFoundError("product not found"))
    }
    return res.status(200).json(httpResponse(true, "Product search successful", products));
  } catch (err) {
    return res.status(500).json(httpResponse(false, "Product search failed", err.message));
  }
}
module.exports ={addproduct,allproducts,updateproduct,getproduct,deleteproduct,reviewproduct,getAllReviews,deletereview,FilterProducts,SearchProduct}
