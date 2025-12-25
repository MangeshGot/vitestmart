const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderId: { type: String, required: true },
    items: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            qty: { type: Number, required: true },
            size: String,
            image: String
        }
    ],
    total: { type: Number, required: true },
    student: { type: String, required: true },
    studentClass: { type: String, required: true },
    studentDivision: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
