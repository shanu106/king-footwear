const express = require('express');
const router = express.Router();
const adminModel = require('../models/Admin')
const bcrypt = require('bcrypt');
const productModel = require('../models/Product.model');
const cookieParser = require('cookie-parser');
const {tokenAdmin} = require('../utils/tokenAdmin')
const userModel = require('../models/User.model');
const isAdmin = require('../middlewares/isAdmin');
const OrdersModel = require('../models/Orders.model');


router.use(cookieParser());


router.post('/signup', async function (req, res){
    
    let owners = await   adminModel.find();
    if(owners.length > 0){
        res
        .send(503)
     
    }
    let {fullname , email, password} = req.body;
   bcrypt.genSalt(10, (err, salt)=>{
    bcrypt.hash(password, salt , async (err, hash)=>{
        if(err) return res.send(err.message);
        const owner = await adminModel.create({
  
            fullname,
            email,
            password:hash,   
    })
    })
   })
res.send("work complete")
})


router.get('/', (req, res)=>{
   let sucess = req.flash("notOwner")
let user = userModel.find();
    res.render('owner-login',{user,sucess})

})

router.post('/login', async (req, res)=>{
    let {email , password} = req.body;
    let owner = await adminModel.findOne({email:email});
    
    if(!owner){
        res.status(201).json("email or password is incorrect")
    } else {
        
        bcrypt.compare(password, owner.password, (err, result)=>{
            if(result){
                const token = tokenAdmin(owner);

                   res.cookie("token",token, {
        httpOnly: true,
        secure:true,
        sameSite:'None',
        path:'/'
    });
                
               
                // res.cookie("token",token);
    // res.render('shop', {products, added,user})
   res.json(owner);
                // console.log(tokenAdmin(owner));
                //  res.render("createproducts", {sucess,Admin:true});
            } else{
                res.status(201).json("email or password is incorrect") 
                // res.redirect('/login')
            }
        })
    }
})

router.post('/update-order', isAdmin, async (req, res)=>{
    const {orderId, status} = req.body;

    try {
        const order = await OrdersModel.findById(orderId);
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        order.orderStatus = status;
        await order.save();
        res.json({message:"Order status updated successfully", order});
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


// user specific routers can be added here

router.get('/all-users', isAdmin, async (req, res)=>{
    try {
        const users = await userModel.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
})
router.get('/all-products', isAdmin, async (req, res)=>{
    try {
        const products = await productModel.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
})
router.get('/dashboard', isAdmin, async (req, rees)=>{
    res.send("Admin dashboard data")
})

router.get('/logout', isAdmin, (req, res)=>{
    res.clearCookie("token");
    res.send("Admin logged out successfully")
});
router.get('/all-orders', isAdmin, async (req, res)=>{
    try {
        const orders = await OrdersModel.find().populate('customerId').populate("address").populate('items.productId').select('-items.productId.image');
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
module.exports = router;