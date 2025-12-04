const userModel = require("../models/User.model");
const express = require('express');
const sahi = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const productModel = require('../models/Product.model')
const axios = require("axios");
// const { generateToken } = requir../utils/generateTokenken');
const {generateToken} = require('../utils/generateToken')
sahi.use(cookieParser());


module.exports.registerUser = async function(req, res) {
    const response = await axios.get("https://imgs.search.brave.com/WsuOuaqq1ptr3Ze-gEEfiJM3IXFluoL8_bWeV1KnArA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA4Lzg4Lzc3LzYz/LzM2MF9GXzg4ODc3/NjMwOV9GTkszc1Zi/SG54Zzh0TkhlNlA0/QmxTVFBXazFMcDR2/Vi5qcGc",{responseType:'arraybuffer'});
   
    
    try {
        let {email, password,mobile, fullname} = req.body;
   let user = await userModel.findOne({email: email});
   if(user){
    
     return res.send("user already registered");

   }
        bcrypt.genSalt(10,   (err, salt) =>{
           bcrypt.hash(password, salt, async (err, hash)=>{
               if(err) return res.send(err.message)
                   else {
                       let user = await userModel.create({
                           fullname,
                           email,
                           mobile,
                           password:hash,
                           profile:response.data
                          
                          })
                              
                          let products = await productModel.find();
          res.cookie("token",generateToken(user));
          res.json(user);
                   }
           })
   
        })
   
   
   
     
   }
   
   catch(err){
       req.flash("loginErr", err.message);
   }
}

module.exports.loginUser = async function (req, res) {
    let {email , password} = req.body;

   
    let user = await userModel.findOne({email}).select('+password');
    if(!user){
res.send("email or password is incorrect");

    }
else {
    bcrypt.compare(password, user.password, async (err , result)=>{
        console.log(result);    
        if(result) {
            let products = await productModel.find();
            const token = generateToken(user);
    res.cookie("token",token, {
        httpOnly: true,
        secure:true,
        sameSite:'None',
        path:'/'
    });
    // res.render('shop', {products, added,user})
   res.json({user,token});
        
        }
        else {
            console.log(err);
        res.send("email or password is missmatched");
        }
    })
}
}