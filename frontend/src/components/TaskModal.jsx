import React, { useState, useEffect } from 'react';

const TaskModal = ({ task, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  
  // Subtasks state
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Errors state
  const [errors, setErrors] = useState({});

  // If task is provided, populate the form (editing mode)
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
      setCategory(task.category || 'General');
      
      if (task.dueDate) {
        // Format ISO date to YYYY-MM-DD for HTML input
        setDueDate(new Date(task.dueDate).toISOString().substring(0, 10));
      } else {
        setDueDate('');
      }

      setSubtasks(task.subtasks || []);
    } else {
      // Clear form (creating mode)
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setCategory('General');
      setDueDate('');
      setSubtasks([]);
    }
    setErrors({});
  }, [task]);

  // Handle Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!title || title.trim().length < 3) {
      newErrors.title = 'Task title must be at least 3 characters long.';
    }
    if (title.length > 100) {
      newErrors.title = 'Task title cannot exceed 100 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Save Trigger
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave({
      _id: task ? task._id : undefined,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      category: category.trim() || 'General',
      dueDate: dueDate ? new Date(dueDate) : null,
      subtasks
    });
  };

  // Add Subtask helper
  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    
    setSubtasks([
      ...subtasks,
      {
        title: newSubtaskTitle.trim(),
        isCompleted: false
      }
    ]);
    setNewSubtaskTitle('');
  };

  // Toggle Subtask Helper
  const handleToggleSubtask = (index) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].isCompleted = !updatedSubtasks[index].isCompleted;
    setSubtasks(updatedSubtasks);
  };

  // Delete Subtask Helper
  const handleDeleteSubtask = (index) => {
    const updatedSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(updatedSubtasks);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h2 className="modal-title gradient-text-glow">
            {task ? 'Edit Task Details' : 'Create New Task'}
          </h2>
          <button className="btn-icon" onClick={onClose} style={{ fontSize: '1.5rem' }}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="What needs to be done? (e.g., Launch Beta App)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input form-textarea"
              rows="3"
              placeholder="Add links, resources, guidelines or extra context here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Status Segmented Control */}
            <div className="form-group">
              <label className="form-label">Status</label>
              <div className="segmented-control">
                <button
                  type="button"
                  className={`segmented-option ${status === 'todo' ? 'active' : ''}`}
                  onClick={() => setStatus('todo')}
                >
                  To Do
                </button>
                <button
                  type="button"
                  className={`segmented-option ${status === 'in-progress' ? 'active' : ''}`}
                  onClick={() => setStatus('in-progress')}
                >
                  In Progress
                </button>
                <button
                  type="button"
                  className={`segmented-option ${status === 'completed' ? 'active' : ''}`}
                  onClick={() => setStatus('completed')}
                >
                  Done
                </button>
              </div>
            </div>

            {/* Priority Segmented Control */}
            <div className="form-group">
              <label className="form-label">Priority</label>
              <div className="segmented-control">
                <button
                  type="button"
                  className={`segmented-option priority-option-low ${priority === 'low' ? 'active' : ''}`}
                  onClick={() => setPriority('low')}
                >
                  Low
                </button>
                <button
                  type="button"
                  className={`segmented-option priority-option-medium ${priority === 'medium' ? 'active' : ''}`}
                  onClick={() => setPriority('medium')}
                >
                  Med
                </button>
                <button
                  type="button"
                  className={`segmented-option priority-option-high ${priority === 'high' ? 'active' : ''}`}
                  onClick={() => setPriority('high')}
                >
                  High
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Category with suggestion chips */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-input"
                placeholder="Create custom category (e.g., Sprint, Client, Finance)..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <div className="suggestion-chips">
                {['General', 'Work', 'Personal', 'Shopping', 'Urgent'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={`suggestion-chip ${category === preset ? 'active' : ''}`}
                    onClick={() => setCategory(preset)}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Checklist Builder */}
          <div className="form-group">
            <label className="form-label">Subtask Checklist</label>
            <div className="subtasks-builder-container">
              <div className="modern-input-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Break this task down into smaller checklist steps..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                />
                <button
                  type="button"
                  className="inline-add-btn"
                  onClick={handleAddSubtask}
                >
                  + Add
                </button>
              </div>

              {subtasks.length > 0 ? (
                <div className="subtasks-list-scroll">
                  {subtasks.map((sub, index) => (
                    <div key={index} className="subtask-builder-item">
                      <div className="subtask-builder-text">
                        <span
                          className={`modal-subtask-check ${sub.isCompleted ? 'checked' : ''}`}
                          onClick={() => handleToggleSubtask(index)}
                          role="checkbox"
                          aria-checked={sub.isCompleted}
                        >
                          {sub.isCompleted ? '☑' : '☐'}
                        </span>
                        <span style={{ textDecoration: sub.isCompleted ? 'line-through' : 'none', opacity: sub.isCompleted ? 0.6 : 1 }}>
                          {sub.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn-icon delete-btn"
                        onClick={() => handleDeleteSubtask(index)}
                        title="Remove Subtask"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', margin: '0.5rem 0' }}>
                  No subtasks added yet.
                </p>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-action-buttons">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
