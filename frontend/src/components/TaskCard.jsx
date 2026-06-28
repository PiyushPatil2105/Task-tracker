import React from 'react';

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const { title, description, status, priority, category, dueDate, subtasks = [] } = task;

  const isCompleted = status === 'completed';

  // Check subtask progress
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter((s) => s.isCompleted).length;
  const subtaskPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Date styling and warning check
  let dateText = '';
  let dateClass = 'due-date-display';
  
  if (dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);

    dateText = new Date(dueDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    if (isCompleted) {
      // No warnings if task is already done
      dateClass += '';
    } else if (taskDate < today) {
      dateClass += ' overdue';
      dateText = `Overdue: ${dateText}`;
    } else if (taskDate.getTime() === today.getTime()) {
      dateClass += ' due-today';
      dateText = `Due Today: ${dateText}`;
    }
  }

  return (
    <article className={`task-card glass-panel priority-${priority} animate-fade-in`}>
      {/* Header with Title and Toggle Box */}
      <div className="task-card-header">
        <div
          className={`checkbox-circle ${isCompleted ? 'checked' : ''}`}
          onClick={() => onToggleComplete(task)}
          title={isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
          role="checkbox"
          aria-checked={isCompleted}
        >
          {isCompleted && '✓'}
        </div>
        <h3 
          className={`task-card-main-title ${isCompleted ? 'completed' : ''}`}
          onClick={() => onEdit(task)}
          title="Click to Edit"
        >
          {title}
        </h3>
      </div>

      {/* Body Description */}
      <p className="task-card-body">
        {description || <span style={{ fontStyle: 'italic', opacity: 0.5 }}>No description provided.</span>}
      </p>

      {/* Subtasks Progress Indicator */}
      {totalSubtasks > 0 && (
        <div className="subtask-mini-preview-container">
          <div className="subtask-mini-details">
            <span>Checklist</span>
            <span>{completedSubtasks}/{totalSubtasks} ({subtaskPercent}%)</span>
          </div>
          <div className="mini-progress-track">
            <div className="mini-progress-bar" style={{ width: `${subtaskPercent}%` }}></div>
          </div>
        </div>
      )}

      {/* Footer Info Row */}
      <div className="task-meta-row">
        <div className="task-tags">
          <span className={`tag-badge priority-${priority}`}>
            {priority.toUpperCase()}
          </span>
          <span className="tag-badge category">
            {category || 'General'}
          </span>
        </div>

        {dueDate && (
          <div className={dateClass}>
            <span role="img" aria-label="clock">📅</span> {dateText}
          </div>
        )}
      </div>

      {/* Floating Card Actions */}
      <div className="task-meta-row" style={{ marginTop: '0', paddingTop: '0.5rem', borderTop: 'none', justifyContent: 'flex-end' }}>
        <div className="task-actions">
          <button className="btn-icon edit-btn" onClick={() => onEdit(task)} title="Edit Task">
            ✏️
          </button>
          <button className="btn-icon delete-btn" onClick={() => onDelete(task._id)} title="Delete Task">
            🗑️
          </button>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
