const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
    price: { type: Number, required: true },
    phone: { type: String, required: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    location: { type: String, required: true },
    approved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Ad', adSchema, 'ads');
