const Razorpay = require('razorpay'); 
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});

const renderProductPage = async(req,res)=>{

    try {
        
        res.render('product');

    } catch (error) {
        console.log(error.message);
    }

}

// const createOrder = async(req,res)=>{
//     console.log("S")
//     try {
//         const amount = req.body.amount*100
//         console.log(amount)
//         const options = {
//             amount: amount,
//             currency: 'INR',
//             receipt: 'razorUser@gmail.com'
//         }

//         razorpayInstance.orders.create(options, 
//             (err, order)=>{
//                 if(!err){
//                     res.status(200).send({
//                         success:true,
//                         msg:'Order Created',
//                         order_id:order.id,
//                         amount:amount,
//                         key_id:RAZORPAY_ID_KEY,
//                         product_name:req.body.name,
//                         description:req.body.description,
//                         contact:"1234567890",
//                         name: "gopalreddy",
//                         email: "gopal@gmail.com"
//                     });
//                 }
//                 else{
//                     res.status(400).send({success:false,msg:'Something went wrong!'});
//                 }
//             }
//         );

//     } catch (error) {
//         console.log(error.message);
//     }
// }


module.exports = {
    renderProductPage
   // createOrder
}

// const amount=async(req,res)=>{
//     try{
//      const obj= await order.findById(req.params.id)
//      const amnt=obj.totalPrice
//      return res
//       .status(200).json({amount:amnt})
//     //   .json(httpResponse(true, "amount retreived ",amnt));
//     }
//     catch(err){
         
//         return res.status(500).json({error: err});
//         // .json(httpResponse(false, "amount retreive failed",err.message));
//     }



// }
// module.exports = {
//     renderProductPage,
//     createOrder,amount
// }