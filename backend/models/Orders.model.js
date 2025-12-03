const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        razorpay_order_id: {
            type: String,
            unique: true,
            required: true,
        },
        razorpay_payment_id: {
            type: String,
            unique: true,
            required: true,
        },
        razorpay_signature: {
            type: String,
            unique: true,
            required: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                size:

                    {
                        type: Number,
                            enum: [7, 8, 9, 10],
                            default: 7,
                    }
                ,
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
               
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
        address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Address',
            required: true,
        },
        orderStatus:{
            type: String,
            enum: ['created','in transit', 'processed', 'shipped', 'delivered', 'cancelled'],
            default: 'placed',
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);