const express = require('express');
const router = express.Router();
const upload = require('../config/multer.config');
const productModel = require('../models/Product.model');
const isadmin = require('../middlewares/isAdmin');
router.post('/create',isadmin,upload.single("image"), async (req, res)=>{
 try{    let {name, price,  discount, size, available,quantity} = req.body
let product = await productModel.create({
    image: req.file.buffer,
name,
price,
size,
discount,
available,
quantity

})
res.send("product created sucessfully")
 } catch(error){
    console.log(error);
   res.status(500).send("internal server error")
 }
})

router.post('/edit', isadmin, async(req, res, )=>{
    try {
        let {id, name, price, discount, size, available, quantity} = req.body;
        
        let product = await productModel.findByIdAndUpdate(id, {
            name,
            price,
            discount,
            size,
            available,
            quantity
        }, {new:true});
        res.send("product updated sucessfully")

    } catch (error) {
        console.log(error);
        res.status(500).send("internal server error")
    }
})

router.get("/delete/:id", isadmin, async (req, res)=>{
    try {
        let id = req.params.id;
        await productModel.findByIdAndDelete(id);
        res.send("product deleted sucessfully")
    } catch (error) {
        console.log(error);
        res.status(500).send("internal server error")
    }
})

module.exports = router;