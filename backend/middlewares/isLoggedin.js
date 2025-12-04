const jwt = require('jsonwebtoken');
const userModel = require('../models/User.model');


module.exports = async function (req, res, next) {

   
   console.log("is logged in  req ",req)
    const token = req.headers.Authorization? req.headers.Authorization.split(' ')[1]: req.cookies.token;
 if (!token) {
   console.log("no token found");
    return res.redirect('/')
 } 
 
 try {
    let decode = jwt.verify(token, process.env.JWT_KEY);
    let user = await userModel.findOne({email: decode.email}).select ('-password');
 
    req.user = user;
    
    next();
                
 } catch (err){
   console.log("error in isLoggedin middleware", err);
    res.redirect('/');
 }
}