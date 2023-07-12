const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    default: "user"
  },
  Token: {
    type: String
  },
  OTP:{
   type: String
  }
});
const User = mongoose.model('User', UserSchema);
module.exports = User;
