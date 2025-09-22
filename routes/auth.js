const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Ad = require('../models/Ad');

const router = express.Router();

// Helper: Validate email format
function isValidEmail(email) {
    // Basic email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// REGISTER API
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, ip, environment, browser, premium } = req.body;

        // 1. Check for empty required fields
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All required fields (firstName, lastName, email, password) must be provided" });
        }

        // 2. Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // 3. Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // 4. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create user
        const newUser = new User({
            firstName,
            lastName,
            email: email.toLowerCase(), // store in lowercase
            hashedPassword,
            ip: ip || req.ip,
            environment: environment || "Unknown",
            browser: browser || "Unknown",
            premium: premium || 0
        });

        await newUser.save();

        return res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});
// LIST USERS API
router.get('/users', async (req, res) => {
    try {
        // Fetch all users (excluding hashed password for security)
        const users = await User.find({}, { hashedPassword: 0 });

        return res.status(200).json({
            count: users.length,
            users
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});
// LIST ADS API
router.get('/ads', async (req, res) => {
    try {
        // Get page and limit from query params, default to page 1 and 10 items per page
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate skip value
        const skip = (page - 1) * limit;

        // Fetch paginated ads
        const ads = await Ad.find({})
            .skip(skip)
            .limit(limit);

        // Get total count for pagination info
        const total = await Ad.countDocuments();

        return res.status(200).json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            count: ads.length,
            ads
        });
    } catch (error) {
        console.error("Error fetching ads:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
module.exports = router;
