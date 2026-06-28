import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Subtask title is required'],
    trim: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
});

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Task title must be at least 3 characters long'],
      maxlength: [100, 'Task title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: ['todo', 'in-progress', 'completed'],
        message: '{VALUE} is not a valid task status'
      },
      default: 'todo'
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid task priority'
      },
      default: 'medium'
    },
    category: {
      type: String,
      trim: true,
      default: 'General'
    },
    dueDate: {
      type: Date
    },
    subtasks: [subtaskSchema]
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
