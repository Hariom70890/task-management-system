const Task = require("../models/taskModel");
const User = require("../models/userModel");
const { validateTask } = require("../utils/validation");

// Create Task
 const createTask = async (req, res) => {
  try {
      const {title, description, startDate, endDate, priority, assignedTo} = req.body;
      const {error} = validateTask( req.body );
 if (error) return res.status(400).json({ message: error.details[0].message });

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can create tasks." });
        }
    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ error: "End date must be after start date" });
    }

    // Assuming `req.user` has authenticated user details
    const creator = { id: req.user._id, name: req.user.name };

    // Find assigned user
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(404).json({ error: "Assigned user not found" });
    }

    const task = await Task.create({
      title,
      description,
      startDate,
      endDate,
      priority,
      assignedTo: { id: assignedUser._id, name: assignedUser.name },
      creator,
    });
 if (req.body.assignedTo) {
            await User.findByIdAndUpdate(req.body.assignedTo, { $push: { tasks: task._id } });
        }
        console.log('task:-',task)
        res.status(201).json({ message: "Task created successfully", task });
    
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Tasks (with pagination)
const getTask = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const tasks = await Task.find()
            .skip(skip)
            .limit(limit)
            .populate("creator", "name email")
            .populate("assignedTo", "name email");

        const total = await Task.countDocuments();

        res.status(200).json({
            message: "Tasks retrieved successfully",
            tasks,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalTasks: total,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving tasks", error: error.message });
    }
};

// Update Task
const updateTask = async (req, res) => {
    try {
        const { error } = validateTask(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const task = await Task.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        if (!task) return res.status(404).json({ message: "Task not found" });

        res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
};

// Delete Task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id });
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (task.assignedTo) {
            await User.findByIdAndUpdate(task.assignedTo.id, { $pull: { tasks: task._id } });
        } 
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
};

// Get User Tasks
const getUserTasks = async (req, res) => {
    try {
        const userId = req.user._id; 
        const tasks = await Task.find({ "assignedTo.id": userId }).populate("creator", "name email");

        res.status(200).json({ message: "Tasks retrieved successfully", tasks });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving tasks", error: error.message });
    }
};

module.exports = { getTask, createTask, updateTask, deleteTask, getUserTasks };
