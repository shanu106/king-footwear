const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    image:Buffer,
    name:String,
    price:Number,
    discount: {
        type:Number,
        default: 0
    },
    size:[{
        type: Number,
            enum: [7, 8, 9, 10],
            default: 7,
    }],

    available:{
        type: Boolean,
        default: true
    },
    quantity:[{
        type: Number,
        default: 0,
        min: 0
    }],
    category:{
        type: String,
        enum: ['sports', 'casual', 'formal', 'boots', 'sandals'],
        default: 'sandals'
    },

    
})

module.exports = mongoose.model("Product", productSchema);