const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const { Schema } = mongoose

const emailRegex = /^\S+@\S+\.\S+$/

const UserSchema = new Schema(
    {
        fullname: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: emailRegex,
        },
        password: { type: String, required: true, minlength: 6, select: false },

        // Reference to a single Cart document
        mobile: { type: String, required: true, minlength: 10, maxlength: 13 },
        cart: { type: Schema.Types.ObjectId, ref: 'Cart' },

        // References to multiple Order documents
        orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
        addresses: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
       
    },
   
    { timestamps: true }
)


module.exports = mongoose.model('User', UserSchema)