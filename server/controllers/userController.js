const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { validateUser, validateLogin } = require("../utils/validation");

// Register User
const registerUser = async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const user = await User.create(req.body);
        const token = jwt.sign( {id: user._id, role: user.role}, process.env.SECRET_KEY, {expiresIn: "1h"} );
         res.cookie('token', token, {
            httpOnly: true, // Prevent access by JavaScript
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'strict', // CSRF protection
            maxAge: 60 * 60 * 1000 * 7, 
        } );
        console.log("token")
        res.status(201).json({
            message: "User created successfully",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        // console.log( "Token at login:-", token );
        // Store the token in cookies
        res.cookie('token', token, {
            httpOnly: true, // Prevent access by JavaScript
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'strict', // CSRF protection
            maxAge: 60 * 60 * 1000 * 7, 
        } );
        
        // console.log("Cookies set in response:", res.getHeaders()['set-cookie']); 
        res.status(200).json({
            message: 'Logged in successfully',
            token:token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};


// Get Users
const getUser = async (req, res) => {
    try {
        const users = await User.find( {role: "user"} ).select( "-password" );
        res.status( 200 ).json( {message: "Users retrieved successfully", users} );
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
};


// createuser 
const createUser = async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { name, email, password,role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const user = await User.create(req.body); 
        res.status(201).json({
            message: "User created successfully", 
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    console.log("req :-",req.user)
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can delete users." });
        }

        const { id } = req.params;
        await User.findByIdAndDelete(id);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error });
    }
};

const logoutUser = async (req, res) => {
    try {
        // Clear the cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out', error: error.message });
    }
};




module.exports = {
    registerUser,
    loginUser,
    getUser,
    createUser,
    deleteUser,
    logoutUser
};
