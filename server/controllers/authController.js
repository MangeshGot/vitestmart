const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { full_name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
        full_name,
        email,
        password
    });

    if (user) {
        res.status(201).json({
            success: true,
            user: {
                _id: user._id,
                full_name: user.full_name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            }
        });
    } else {
        res.status(400).json({ error: 'Invalid user data' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            success: true,
            user: {
                _id: user._id,
                full_name: user.full_name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            }
        });
    } else {
        res.status(401).json({ error: 'Invalid email or password' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.full_name = req.body.full_name || user.full_name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            success: true,
            user: {
                _id: updatedUser._id,
                full_name: updatedUser.full_name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser._id)
            }
        });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
};

module.exports = {
    registerUser,
    authUser,
    updateUserProfile
};
