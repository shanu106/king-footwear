
const jwt = require('jsonwebtoken');
const adminModel = require('../models/Admin');
module.exports = async function (req, res, next) {

    
    if (!req.cookies.token) {
        console.log("no token found in admin middleware");
        return res.redirect('/')
    } 
    try {
       let decode = jwt.verify(req.cookies.token, process.env.JWT_KEY1);
       let admin = await adminModel.findOne({email: decode.email}).select ('-password');
   
       req.admin = admin
       next();
                   
    } catch (err){
        console.log("error ",err);
       res.redirect('/');
    }
   }