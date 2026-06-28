import React from 'react';

const FilterBar = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  categories = [],
  onAddNewTask
}) => {
  return (
    <div className="filter-bar glass-panel animate-slide-up">
      {/* Search Input */}
      <div className="search-box-wrapper">
        <span className="search-icon" role="img" aria-label="search">🔍</span>
        <input
          type="text"
          className="form-input search-input"
          placeholder="Type keywords to filter your dashboard instantly..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Select Filters */}
      <div className="filter-selects">
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by Status"
        >
          <option value="all">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          className="form-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          aria-label="Filter by Priority"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <select
          className="form-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by Category"
        >
          <option value="all">All Categories</option>
          <option value="General">General</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Shopping">Shopping</option>
          <option value="Urgent">Urgent</option>
          {categories
            .filter((c) => c && !['General', 'Work', 'Personal', 'Shopping', 'Urgent'].includes(c))
            .map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
        </select>

        <select
          className="form-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort by"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="dueDate-asc">Due Date (Soonest)</option>
          <option value="dueDate-desc">Due Date (Furthest)</option>
        </select>
      </div>

      {/* Action Button */}
      <div className="action-buttons">
        <button className="btn btn-primary" onClick={onAddNewTask}>
          <span style={{ fontSize: '1.2rem', marginRight: '0.2rem' }}>+</span> Add Task
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
