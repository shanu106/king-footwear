const mongoose = require('mongoose');


const adminSchema = mongoose.Schema({

    fullname: {
        type: String,
        minLength: 3,
        trim: true
    },
    email: String,
    password: String,

    products: {
        type: Array
    },
    picture: String,
    gstin: String
})

module.exports = mongoose.model("admin", adminSchema);