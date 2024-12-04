const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Authenticate Middleware
const authenticate = async (req, res, next) => {
    // console.log("Cookies:", req.cookies); // Log all cookies
    try {
        const token = req.cookies.token;
        // console.log("Token from cookies:", token);
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};


// Authorize Admin Middleware
const authorizeAdmin = ( req, res, next ) => {
    console.log("admin:-",req.user)
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

// Authorize Task Assignee or Admin Middleware
const authorizeTask = async ( req, res, next ) => {
    console.log("task:-",req)
    try {
        const taskId = req.params.id;
        const Task = require('../models/taskModel');
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.assignedTo.id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized access to this task' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Authorization error', error: error.message });
    }
};

module.exports = { authenticate, authorizeAdmin, authorizeTask };
