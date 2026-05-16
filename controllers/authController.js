const User = require("../models/authSchema");
const jwt = require("jsonwebtoken");
const {
    authenticateJwt,
    loadAdminUser,
} = require("../middleware/accessControl");

exports.register = async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;
        const newUser = new User({ username, email, phone });
        
        await User.register(newUser, password);
        
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    
    // passport-local-mongoose provides the authenticate method
    User.authenticate()(username, password, (err, user, options) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        
        if (!process.env.AUTH_SECRET) {
            console.error("CRITICAL ERROR: AUTH_SECRET is not defined in environment variables");
            return res.status(500).json({ error: "Internal Server Error: Missing JWT Secret" });
        }

        // Generate JWT (minimal claims; permissions resolved from DB on each protected call)
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.AUTH_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                permissions: user.permissions || [],
            }
        });
    });
};

exports.getMe = [authenticateJwt, loadAdminUser, (req, res) => {
    const u = req.adminUser;
    res.status(200).json({
        id: u._id,
        username: u.username,
        email: u.email,
        phone: u.phone,
        role: u.role,
        permissions: u.permissions || [],
    });
}];
