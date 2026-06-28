import React from 'react';

const Dashboard = ({ tasks }) => {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const total = safeTasks.length;
  const completed = safeTasks.filter((t) => t.status === 'completed').length;
  const inProgress = safeTasks.filter((t) => t.status === 'in-progress').length;
  const pending = safeTasks.filter((t) => t.status === 'todo').length;
  
  // Urgent: High priority tasks that are not completed
  const urgent = safeTasks.filter((t) => t.priority === 'high' && t.status !== 'completed').length;

  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // SVG circular properties
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <section className="dashboard-grid animate-slide-up">
      {/* 4 Stats Cards Grid */}
      <div className="stats-container">
        <div className="stat-card glass-panel all">
          <span className="stat-title">Total Tasks</span>
          <div className="stat-value-row">
            <span className="stat-value">{total}</span>
            <span className="stat-icon" role="img" aria-label="all tasks">📋</span>
          </div>
        </div>

        <div className="stat-card glass-panel pending">
          <span className="stat-title">To Do</span>
          <div className="stat-value-row">
            <span className="stat-value">{pending}</span>
            <span className="stat-icon" role="img" aria-label="todo tasks">⏳</span>
          </div>
        </div>

        <div className="stat-card glass-panel progress">
          <span className="stat-title">In Progress</span>
          <div className="stat-value-row">
            <span className="stat-value">{inProgress}</span>
            <span className="stat-icon" role="img" aria-label="in-progress tasks">⚙️</span>
          </div>
        </div>

        <div className="stat-card glass-panel completed">
          <span className="stat-title">Completed</span>
          <div className="stat-value-row">
            <span className="stat-value">{completed}</span>
            <span className="stat-icon" role="img" aria-label="completed tasks">✅</span>
          </div>
        </div>

        <div className="stat-card glass-panel urgent">
          <span className="stat-title">Urgent Active</span>
          <div className="stat-value-row">
            <span className="stat-value">{urgent}</span>
            <span className="stat-icon" role="img" aria-label="urgent tasks">🔥</span>
          </div>
        </div>
      </div>

      {/* Circle Gauge Card */}
      <div className="chart-card glass-panel">
        <span className="stat-title">Task Completion</span>
        <div className="progress-circle-container">
          <svg className="progress-ring" width="110" height="110">
            {/* Background Circle */}
            <circle
              className="progress-ring__circle"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="8"
              fill="transparent"
              r={radius}
              cx="55"
              cy="55"
            />
            {/* Indicator Circle */}
            <circle
              className="progress-ring__circle"
              stroke="url(#gradientCyanPurple)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              fill="transparent"
              r={radius}
              cx="55"
              cy="55"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradientCyanPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-cyan)" />
                <stop offset="100%" stopColor="var(--accent-purple)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="progress-label-center">
            <span className="progress-percent">{percent}%</span>
            <span className="progress-label-sub">Done</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
