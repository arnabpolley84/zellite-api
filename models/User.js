const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email:     { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status:    { type: String, default: "active" },
    ip:        String,
    environment: String,
    browser: String,
    premium:  { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);
