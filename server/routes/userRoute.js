const express = require('express');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const {
    registerUser,
    loginUser,
    getUser,
    deleteUser,
    logoutUser, 
} = require('../controllers/userController');

const userRouter = express.Router();

// User Registration (Open to all)
userRouter.post('/register', registerUser);

// User Login (Open to all)
userRouter.post('/login', loginUser);

// Logout (Authenticated Users)
userRouter.post('/logout', authenticate, logoutUser);

// Get All Users (Admin only)
userRouter.get('/',authenticate, getUser);

// Delete a User (Admin only)
userRouter.delete('/:id', authenticate, deleteUser);

module.exports = userRouter;
