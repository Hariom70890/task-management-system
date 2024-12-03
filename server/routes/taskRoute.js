const express = require('express');
const { authenticate, authorizeAdmin, authorizeTask } = require('../middleware/auth');
const {
    createTask,
    getTask,
    updateTask,
    deleteTask,
    getUserTasks
} = require('../controllers/taskController');

const taskRouter = express.Router();

// Create a Task (Admin only)
taskRouter.post('/', authenticate, createTask);

// Get All Tasks (Paginated)
taskRouter.get('/', authenticate, getTask);

// Get Tasks Assigned to the Current User
taskRouter.get('/my-tasks',authenticate,  getUserTasks);

// Update a Task (Admin or Assigned User)
taskRouter.put('/:id',authenticate,  updateTask);

// Delete a Task (Admin only)
taskRouter.delete('/:id',authenticate,  deleteTask);

module.exports = taskRouter;
