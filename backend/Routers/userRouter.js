const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController.js');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const jwt = require("jsonwebtoken");
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const {config} = require('dotenv');
const addressModel = require('../models/address.model.js');
config({path:"./.env"})
//  const instance = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET
// })

const userModel = require("../models/User.model.js");
const isLoggedin = require('../middlewares/isLoggedin');
const productModel = require('../models/Product.model.js');
const crypto = require('crypto');
const upload = require('../config/multer.config');
const OrdersModel = require('../models/Orders.model.js');
const ProductModel = require('../models/Product.model.js');


router.post('/signup', registerUser)

router.post('/login', loginUser)
router.get('/products', async (req, res)=>{
    let products = await productModel.find();
    res.json(products);
})
router.get('/get-product/:id', async (req, res)=>{
    try {
        
        let id = req.params.id;
        let product = await productModel.findById(id);
      
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).send("internal server error") 
    }
})
router.post('/order', isLoggedin, async (req, res)=>{
    

});
router.post('/add-address',isLoggedin, async (req, res)=>{
   
    const {fullName,phone,street,city,state,zipCode,country,isDefault} = req.body;
    const userId = req.user.id;
    try {
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const newAddress = {
            user: user._id,
            fullName,
            phone,
            street,
            city,
            state,
            zipCode,
            country,
            isDefault
        };
        const address = await addressModel.create(newAddress);
       
      user.addresses.push(address._id);
        await user.save();
        res.status(201).json({message:"Address added successfully", address});
    } catch (error) {
        
    }
})
router.post('/edit-address/:id',isLoggedin, async (req, res) =>{
    const addressId = req.params.id;
    const {fullName,phone,street,city,state,zipCode,country,isDefault} = req.body;
    try {
        let address = await addressModel.findById(addressId);
   
        if(!address){
            return res.status(404).json({message:"Address not found"});
        }
        address.fullName = fullName || address.fullName;
        address.phone = phone || address.phone;
        address.street = street || address.street;
        address.city = city || address.city;
        address.state = state || address.state;
        address.zipCode = zipCode || address.zipCode;
        address.country = country || address.country;
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

        await address.save();
        res.status(200).json({message:"Address updated successfully", address});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Server error"});
    }
})
router.get('/get-address', isLoggedin, async (req, res)=>{
    const userId = req.user.id;
    try {
        const user = await userModel.findById(userId).populate('addresses');
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({addresses: user.addresses});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Server error"});
    }
})

router.post('/create-order', isLoggedin, async (req, res)=>{

    const customerId = req.user.id;

   
    // Extract from nested body if it exists, otherwise from req.body directly
    const orderData = req.body.body || req.body;
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature,totalAmount,paymentStatus,address,items} = orderData;
   
 

    try {
        if (!items || !Array.isArray(items)) {
            console.log("Invalid items array");
            return res.status(400).json({message:"Items array is required"});
        }
    
             const formattedItems = items.map(item => ({
            productId: item.productId,
            size : item.size,
            quantity: item.quantity
        }))
      
    
      
        const newOrder = await OrdersModel.create({
            customerId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            totalAmount,
            paymentStatus,
            address,
            items: formattedItems,
            orderStatus:'created'
        })
        const user = await userModel.findById(customerId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        user.orders.push(newOrder._id);
        await user.save();
        
        for(let i=0;i<formattedItems.length;i++){
            const product = await ProductModel.findById(formattedItems[i].productId);
            if(product && product.quantity >= formattedItems[i].quantity ){
                product.quantity[size-7] -= formattedItems[i].quantity;
                await product.save();
            }
        }
       
        res.status(201).json({message:"Order created successfully", order: newOrder});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Server error",error: error.message});
    }
})

router.get('/get-orders', isLoggedin, async (req, res)=>{
    const userId = req.user.id;
    try {
        const orders = await OrdersModel.find({customerId: userId})
            .populate('customerId')
            .populate('address')
            .populate('items.productId');
        res.status(200).json({orders});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Server error"});
    }
})

module.exports = router;


        // "Crashing while saving package due to exception \"We could not manifest this order as we don't service this pincode 458441 \". Package might have been partially saved."
      