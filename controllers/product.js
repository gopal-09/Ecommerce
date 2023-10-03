const Product = require('../models/product');
//const  createIndex = require('../models/search');
const  httpResponse = require("../helpers/helper")
const CustomError = require("../errors");
//let elasticsearch = require('elasticsearch');
const { Client} = require('@elastic/elasticsearch');
const {elastic_name, elastic_pass,localhost} = process.env;
const client = new Client({
  //node:'http://localhost:9200',//replace localhost
  node: 'http://elasticsearch:9200',
  auth: {
    username: elastic_name, // Replace with your Elasticsearch username
    password:  elastic_pass, // Replace with your Elasticsearch password
  },
});
// require('../models/search')(elasticClient);
// const indexName = 'reddy';

addproduct=async(req,res,next)=>{
    const data = req.body;
    //id=req.product
    //console.log(req.product)
    try {
        const product = new Product({
          name: data.name,
          description: data.description,
          images: data.imagesLinks,
          price: data.price,
          Stock: data.Stock,
          category: data.category,
         // product: id
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
    return res.status(200).json(true, "products info",product);
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
      
          return res.status(200)
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
        if (rev.user === req.user) {
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
      //console.log(product.reviews);
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
// FilterProducts=async(req, res, next)=>{
//   const category = req.query.category
//   const mi=parseFloat(req.query.min)
//   const ma=parseFloat(req.query.max)
//   const rating = parseFloat(req.query.ratings)
//   //console.log(rating)
//   try{
//     const products = await Product.aggregate([
//       {
//         $match: { category: category,ratings:rating, price: { $gte: mi, $lt: ma } }
//       }
//     ]);
//     if(products.length==0)
//     return res.status(200).json(httpResponse(true, "no matches found",{}))
//     return res.status(200).json(httpResponse(true, "filtered successfully", products))
//   }catch (err) {
//     return res.status(500).json(httpResponse(false, "filter failed", err.message));
//   }
// }
FilterProducts = async (req, res, next) => {
  const { category, min, max, ratings } = req.query;
  const aggregationPipeline = [];

  if (category) {
    aggregationPipeline.push({ $match: { category } });
  }

  if (min !== undefined && max !== undefined) {
    aggregationPipeline.push({
      $match: { price: { $gte: parseFloat(min), $lt: parseFloat(max) } },
    });
  }

  if (ratings !== undefined) {
    aggregationPipeline.push({ $match: { ratings: parseFloat(ratings) } });
  }

  try {
    const products = await Product.aggregate(aggregationPipeline);

    if (products.length === 0)
      return res.status(200).json(httpResponse(true, "No matches found", {}));

    return res.status(200).json(httpResponse(true, "Filtered successfully", products));
  } catch (err) {
    return res.status(500).json(httpResponse(false, "Filter failed", err.message));
  }
};


SearchProduct = async (req, res, next) => {
  const search = req.query.search;
  const searchArray = search.split(/\s+/); // Split the search text into an array of words

  const searchQueries = searchArray.map(term => ({
    $or: [
      { name: { $regex: term, $options: "i" } },
      { description: { $regex: term, $options: "i" } }
    ]
  }));

  try {
    const products = await Product.find({ $and: searchQueries });

    if (products.length === 0) {
      return res.status(404).json(httpResponse(false, "Products not found"));
    }

    return res.status(200).json(httpResponse(true, "Product search successful", products));
  } catch (err) {
    return res.status(500).json(httpResponse(false, "Product search failed", err.message));
  }
};
//const indexName = 'products'
// const indexName = 'rai';
// const aliasName = 'product_search'; // Define an alias name

// const createIndex = async () => {
//   await client.indices.create({
//     index: indexName,
//     body: {
//       mappings: {
//         properties: {
//           name: { type: 'text' },
//           description: { type: 'text' },
//         },
//       },
//     },
//   });

//   // Associate the alias with the index
//   await client.indices.putAlias({
//     index: indexName,
//     name: aliasName,
//   });
// };

// createIndex();
const indexName = 'rail';
const aliasName = 'search_product';
// elastic=async (req, res) => {
//   try {
// //     const indexName = 'ral';
// // const aliasName = 'product_searc'; // Define an alias name

// const createIndex = async () => {
//   let indexex = false;
//   await  client.indices.exists({ index: indexName })
//   .then(indexExists => {
//     if (indexExists) {
//       indexex = true;
//     }
//   })
//   .catch(error => {
//     console.error('Error checking index existence:', error);
//   });

//   if(indexex){
//     client.indices.putMapping({
//       index: indexName,
//       body: {
//         properties: {
//           name: { type: 'text' },
//           description: { type: 'text' },
//         },
//       },
//     })
//   }else{
//     client.indices.create({
//       index: indexName,
//       body:{
//         mappings: {
//           properties: {
//             name: { type: 'text' },
//             description: { type: 'text' },
//           },
//         },
//       },
//     });
//   }
  

//   // Associate the alias with the index
//   await client.indices.putAlias({
//     index: indexName,
//     name: aliasName,
//   });
// };
// createIndex();
//   //createIndex("elas");
//   const products = await Product.find()
//     const bulkBody = [];

//     // Create bulk index commands for each product
//     products.forEach(product => {
//       bulkBody.push(
//         { index: { _index: aliasName, _id: product._id } },
//         { name: product.name, description: product.description }
//       );
//     });

//     // Use the Elasticsearch client's bulk API to index data
//     const  body = await client.bulk({ refresh: true, body: bulkBody });

//   const result = await client.search({
//     index:aliasName,
    
//     body: {
//       query: {
//         multi_match: {
//           query:  req.query.query,
//           fields: ['name', 'description'],
//           fuzziness: 'AUTO',
//           minimum_should_match: '50%', // Adjust this value as needed
//         },
//       },
//     },
//   });
//   const hi = result.hits.hits.map(hit => hit._source);
//   res.json(hi);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'An error occurred' });
//   }
// }
elastic = async (req, res) => {
  try {
    const indexName = 'rak';
    const aliasName = 'search'; // Define an alias name

    // Create the index if it doesn't exist
    const indexExists = await client.indices.exists({ index: indexName });

    if (!indexExists) {
      await client.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              name: { type: 'text' },
              description: { type: 'text' },
            },
          },
        },
      });

      // Associate the alias with the index
      await client.indices.putAlias({
        index: indexName,
        name: aliasName,
      });
    }

    // Fetch products from the database
    const products = await Product.find();

    const bulkBody = [];

    // Create bulk index commands for each product
    products.forEach(product => {
      bulkBody.push(
        { index: { _index: indexName, _id: product._id } },
        { name: product.name, description: product.description }
      );
    });

    // Use the Elasticsearch client's bulk API to index data
    await client.bulk({ refresh: true, body: bulkBody });

    // Perform a search
    const result = await client.search({
      index: aliasName,
      body: {
        query: {
          multi_match: {
            query: req.query.query,
            fields: ['name', 'description'],
            fuzziness: 'AUTO',
            minimum_should_match: '50%', // Adjust this value as needed
          },
        },
      },
    });

    const hits = result.hits.hits.map(hit => hit._source);
    res.json(hits);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred' });
  }
}



module.exports ={addproduct,allproducts,updateproduct,getproduct,deleteproduct,reviewproduct,getAllReviews,deletereview,FilterProducts,SearchProduct,elastic}
