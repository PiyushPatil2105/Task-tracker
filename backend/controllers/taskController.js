import Task from '../models/Task.js';

// @desc    Get all tasks with filtering, search, and sorting
// @route   GET /api/tasks
// @access  Public
export const getTasks = async (req, res) => {
  try {
    const { status, priority, category, search, sortBy, order } = req.query;

    // Build query object
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (category && category !== 'all') {
      query.category = { $regex: new RegExp(category, 'i') };
    }

    if (search) {
      query.$or = [
        { title: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } }
      ];
    }

    // Build sort object
    let sort = {};
    if (sortBy) {
      const sortOrder = order === 'asc' ? 1 : -1;
      if (sortBy === 'priority') {
        // Handle priority sorting (custom sorting logic: we can return all and sort, 
        // or sort in mongo. We can use a collation or a virtual if we had one. 
        // For simplicity, let's sort by priority mapping or keep standard sorting in Mongo)
        // Let's sort alphabetically or we can do it on database
        sort.priority = sortOrder; 
      } else {
        sort[sortBy] = sortOrder;
      }
    } else {
      sort.createdAt = -1; // Default: newest first
    }

    const tasks = await Task.find(query).sort(sort);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching tasks', error: error.message });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Public
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Task ID format' });
    }
    res.status(500).json({ message: 'Server Error fetching task', error: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, category, dueDate, subtasks } = req.body;

    // Front-end should validate, but back-end must as well:
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: { title: 'Task title must be at least 3 characters long' } 
      });
    }

    const task = new Task({
      title,
      description,
      status,
      priority,
      category: category || 'General',
      dueDate,
      subtasks: subtasks || []
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Server Error creating task', error: error.message });
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
// @access  Public
export const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, category, dueDate, subtasks } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update fields if provided
    if (title !== undefined) {
      if (title.trim().length < 3) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: { title: 'Task title must be at least 3 characters long' } 
        });
      }
      task.title = title;
    }
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (subtasks !== undefined) task.subtasks = subtasks;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Task ID format' });
    }
    res.status(500).json({ message: 'Server Error updating task', error: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Task ID format' });
    }
    res.status(500).json({ message: 'Server Error deleting task', error: error.message });
  }
};
