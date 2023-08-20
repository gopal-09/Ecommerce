const User = require('../models/signup');
const twilio = require('twilio')
const CustomError = require("../errors");
const  httpResponse  = require("../helpers/helper")
const StatusCodes = require("http-status-codes");
const JWT = require("jsonwebtoken")
const {check,validationResult} = require("express-validator");
 const bcrypt =  require('bcrypt')
 require("dotenv").config()
 //const ACCOUNT_SID =;
//const AUTH_TOKEN = ;
  const client = twilio(ACCOUNT_SID, AUTH_TOKEN);
signup=async (req,res,next) => {
    try {
      const { name,email, password, mobileNumber,role } = req.body;
      const errors = validationResult(req);
    if(!errors.isEmpty())
    // return res.json({"errors": errors})
    return next(CustomError.BadRequestError(errors));
      const person=await User.findOne({ email})
      if(person)
      {
      return next(new CustomError.BadRequestError("User Already Exists"));

      // return  res.json({message:"user already exists"})
      }
      const hashedPassword=bcrypt.hashSync(password,10)
         const user=new User({name,
                email,
                mobileNumber,
                role,
                password:hashedPassword})
      const token =JWT.sign({email},process.env.Secret_key, {expiresIn: 360000});
      user.Token=token;
      await user.save();
      
       return res
    .status(StatusCodes.OK)
    .json(httpResponse(true, "user signup successful",user));
    } catch (error) {
        //res.status(500).json({ success: false, message: 'Failed to signup',Error: error.message});
        return  res
    .status(500)
    .json(httpResponse(false, "user signup failed",error.message));
    }
}
login_with_otp=async(req,res,next)=>{
  const number=req.body.mobileNumber;
  const user=User.findOne({mobileNumber:number});
  if(!user){
    return next(new CustomError.NotFoundError("User not Exist"));
  }
  // Generate a random 6-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const token =JWT.sign({email},process.env.Secret_key, {expiresIn: 360000});
      user.Token=token;
    user.OTP=otp;
    await user.save();
    client.messages
      .create({
        body: `Your OTP is: ${otp}`,
        from: process.env.twiliomobileNumber,
        to: mobileNumber,
      })
      .then(() => {
        res
    .status(200)
    .json(httpResponse(true, "OTP sent successful",user));
      })
      .catch((error) => {
        console.error('Error sending OTP:', error);
        return  res
    .status(500)
    .json(httpResponse(false, "OTP sent failed",error.message));
      });
    }
    verify_otp=async(req,res,next)=>{
      const { otp } = req.body;
      try{
      const user=User.findOne({_id:req.user});
      if (!user) {
        return next(new CustomError.NotFoundError("User not found"));
      }
      if (user.OTP!==otp) {
        return next(new CustomError.BadRequestError("OTP incorrect"));
      }
      return res
    .status(200)
    .json(httpResponse(true, "user login successful",user));
    }
    catch(error) {
      return  res
      .status(500)
      .json(httpResponse(false, "OTP verification failed",error.message));
    }
}
update_password=async(req,res,next) => {
  const user = await User.findOne({_id:req.user});
    if (!user) {
      return next(new CustomError.NotFoundError("User not found"));
    }
    if (!req.body.newPassword) {
      return next(new CustomError.BadRequestError("Missing password"));
    }
    // if (!hashCompare(_req.body.oldPassword, user.password ?? "")) {
    //   return next(new CustomError.BadRequestError("Wrong password"));
    // }
    const hashedPassword=bcrypt.hashSync(req.body.newPassword,10)
    user.password = hashedPassword;
    await user.save();
    res
      .status(StatusCodes.OK)
      .json(httpResponse(true, "Password updated", {}));
}
user_details=async(req, res, next)=>{
  try{
  const user = await User.findOne({_id:req.user})
  if (!user) {
    return next(new CustomError.NotFoundError("User not found"));
  }
  return res
    .status(200)
    .json(httpResponse(true, "user details",user));

}
catch(err){
  return  res
  .status(500)
  .json(httpResponse(false, "info retreive failed",err.message));
}
}
user_update=async(req, res,next)=>{
  try{
    // const user = await User.findOneAndUpdate({_id:req.user},[
    //   {
    //     $set:req.body,
    //   },
    //   {
    //     $project: {
    //       password: 0,
    //       Token:0,
    //       OTP:0,
    //       __v: 0,
    //     },
    //   },
    // ],
    // {
    //   new: true,
    // })
    const user = await User.findOneAndUpdate(
      {
        _id:req.user,
      },
      {
        $set:req.body,
      },
      {
        new: true,
        projection: {
          password: 0,
          Token:0,
          OTP:0,
          __v: 0,
        },
        runValidators: true,
        useFindAndModify: false,
      }
    );
    if (!user) {
      return next(new CustomError.NotFoundError("User not found"));
    }
    return  res
    .status(200)
    .json(httpResponse(true, "user updated",user));
  }
  catch(err) {
    return  res
    .status(500)
    .json(httpResponse(false, "update failed",err.message));
  }
}
user_delete=async(req, res, next)=>{
  const user = await User.deleteOne({_id:req.user });
  if (!user) {
    return next(new CustomError.NotFoundError("User not found"));
  }
    res
        .status(StatusCodes.NO_CONTENT)
        .json(httpResponse(true, "User deleted", {}));
    
}
get_user=async(req, res, next)=>{
  try{
    const user = await User.findById({_id:req.params.id})
    return res
      .status(200)
      .json(httpResponse(true, "user details",user));
  
  }
  catch(err){
    return  res
    .status(500)
    .json(httpResponse(false, "info retreive failed",err.message));
  }
}
update_user=async(req,res,next)=>{
  try{
    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      [
        {
          $set: req.body,
        },
        {
          $project: {
            password: 0,
            __v: 0,
          },
        },
      ],
      {
        new: true,
      })
    return  res
    .status(200)
    .json(httpResponse(true, "user updated",user));
  }
  catch(err) {
    return  res
    .status(500)
    .json(httpResponse(false, "update failed",err.message));
  }
}
delete_user=async(req, res, next)=>{
  try{
  const user = await User.deleteOne({_id:req.params.id});
    
        return res.status(StatusCodes.NO_CONTENT)
        .json(httpResponse(true, "User deleted", {}));}
        catch(err) {
          return  res
          .status(500)
          .json(httpResponse(false, "user deletion failed",err.message));
        }
}
getAllusers=async (req, res, next) => {
  try{
    const users = await User.find();
    if (!users) {
      return next(new CustomError.NotFoundError("Users not found"));
    }
    return  res
    .status(200)
    .json(httpResponse(true, "users info",users));

  }
  catch(err) {
    return  res
    .status(500)
    .json(httpResponse(false, "users retreive failed",err.message));
  }
}
logout=async(req,res,next) => {
  res.clearCookie('token'); 
  return  res
    .status(200)
    .json(httpResponse(true, "logged out ",{}));
}
// UpdateuserRole=async (req,res,next) => {
//   try {
//   const user = await User.findOne({_id:req.params.id},[{
//     $set:req.body,
//   },
//   {
//     $project: {
//       password: 0,
//       Token:0,
//       OTP:0,
//       __v: 0,
//     },
//   },
// ],
// {
//   new: true,
// })
// return  res
//     .status(200)
//     .json(httpResponse(true, "user updated",user));
//   }
//   catch(err) {
//     return  res
//     .status(500)
//     .json(httpResponse(false, "update failed",err.message));
//   }
// }
module.exports ={signup,login_with_otp,verify_otp,update_password,user_details,user_update,user_delete,get_user,update_user,delete_user,getAllusers,logout}