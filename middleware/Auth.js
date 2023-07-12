const jwt = require("jsonwebtoken");
const User = require('../models/signup');
module.exports = async (req, res, next) => {
    const token = req.header('x-auth-token')
 // CHECK IF WE EVEN HAVE A TOKEN
    if(!token){
        res.status(401).json({
            errors: [
                {
                    msg: "No token found"
                }
            ]
        })
    }
    else{
    try {
        const decoded = await jwt.verify(token, "nfb32iur32ibfqfvi3vf932bg932g")
        //console.log(decoded);
        const a = decoded.email;
        //console.log(typeof(a));
        const k=await User.findOne({email:a});
        //console.log(k);
        req.user = k._id
        //console.log(req.user);
        next()
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}
};
module.exports.Admin=async(req,res,next)=>{
const user=User.findOne({ email:req.user})
if(user.role=='admin')
next();
else{
    return next(new CustomError.BadRequestError(" Not an admin"));
}
}
