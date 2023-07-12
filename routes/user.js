const express = require('express');
const auth= require('../middleware/Auth');
const Admin = require('../middleware/Auth')
const userrouter=express.Router()
const {signup,login_with_otp,verify_otp,update_password,user_details,user_update,user_delete,get_user,update_user,delete_user,getAllusers,logout}=require('../controllers/user');
const { check, validationResult } = require("express-validator");
userrouter.post('/signup',[
    check("email", "Please input a valid email")
        .isEmail(),
    check("password", "Please input a password with a min length of 6")
        .isLength({min: 6}),check("mobileNumber","please input a valid mobile number").isLength({ min: 10, max: 10 })],signup)
userrouter.post('/login',login_with_otp)
userrouter.post('/verify-otp',auth,verify_otp)
userrouter.post('/update-password',auth,update_password)
userrouter.get('/user-details',auth,user_details)
userrouter.put('/user-update',auth,user_update)
userrouter.delete('/user-delete',auth,user_delete)
userrouter.get('/getuser/:id',Admin,get_user)
userrouter.put('/updateuser/:id',Admin,update_user)
userrouter.delete('/deleteuser/:id',Admin,delete_user)
userrouter.get('/getusers',Admin,getAllusers)
userrouter.get('/logout',logout)
module.exports=userrouter