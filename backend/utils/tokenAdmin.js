
const jwt = require('jsonwebtoken')
const tokenAdmin = (owner) =>{
  
    return jwt.sign({email:owner.email}, process.env.JWT_KEY1);
};


module.exports.tokenAdmin = tokenAdmin;