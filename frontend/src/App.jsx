import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FilterBar from './components/FilterBar';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import Toast from './components/Toast';

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // Filters and sorting state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortByState, setSortByState] = useState('createdAt-desc');

  // Custom notifications toast state
  const [toasts, setToasts] = useState([]);

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Handle Search Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);

    return () => clearTimeout(handler);
  }, [search]);

  // Apply Theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-theme');
    } else {
      root.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toast Notification triggers
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, [removeToast]);

  // Fetch Tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const [field, order] = sortByState.split('-');
      
      const queryParams = new URLSearchParams({
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        search: debouncedSearch,
        sortBy: field,
        order: order
      });

      const response = await fetch(`${API_URL}?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      addToast(error.message || 'Error connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, categoryFilter, debouncedSearch, sortByState, addToast]);

  // Re-fetch tasks on query params change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toggle Complete status from grid checkbox
  const handleToggleComplete = async (task) => {
    try {
      const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
      const response = await fetch(`${API_URL}/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update task');
      }

      // Update state locally for real-time responsiveness
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t))
      );
      
      addToast(
        nextStatus === 'completed' ? 'Task completed! Good job!' : 'Task set back to incomplete',
        nextStatus === 'completed' ? 'success' : 'info'
      );
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  // Save Task (Create or Update)
  const handleSaveTask = async (taskData) => {
    try {
      const isEditing = !!taskData._id;
      const url = isEditing ? `${API_URL}/${taskData._id}` : API_URL;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          // Flatten field error messages
          const validationMsg = Object.values(errorData.errors).join(', ');
          throw new Error(validationMsg);
        }
        throw new Error(errorData.message || 'Operation failed');
      }

      await fetchTasks();
      setIsModalOpen(false);
      setEditTask(null);
      addToast(isEditing ? 'Task updated successfully' : 'Task created successfully', 'success');
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  // Delete Task Trigger
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete task');
      }

      // Update locally
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      addToast('Task deleted successfully', 'success');
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const handleEditClick = (task) => {
    setEditTask(task);
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditTask(null);
    setIsModalOpen(true);
  };

  // Extract unique categories from tasks list to enrich drop-down selection
  const uniqueCategories = [...new Set(tasks.map((t) => t.category))].filter(Boolean);

  return (
    <div className="app-container">
      {/* Decorative Circles */}
      <div className="background-decor">
        <div className="decor-circle decor-1"></div>
        <div className="decor-circle decor-2"></div>
      </div>

      {/* Header */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* Stats Dashboard */}
      <Dashboard tasks={tasks} />

      {/* Filters and Controls */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        sortBy={sortByState}
        setSortBy={setSortByState}
        categories={uniqueCategories}
        onAddNewTask={handleAddNewClick}
      />

      {/* Tasks Listing Grid */}
      <main className="tasks-grid-container">
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <div className="logo-icon" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}>◌</div>
            <p className="gradient-text" style={{ fontWeight: 600 }}>Syncing task database...</p>
          </div>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditClick}
              onDelete={handleDeleteTask}
            />
          ))
        ) : (
          <div className="no-tasks-state glass-panel">
            <div className="no-tasks-icon">📋</div>
            <div className="no-tasks-text">
              <h3>No Tasks Found</h3>
              <p>Try refining your filters or search keywords, or add a brand new task!</p>
            </div>
            <button className="btn btn-secondary" onClick={handleAddNewClick} style={{ marginTop: '0.5rem' }}>
              Create New Task
            </button>
          </div>
        )}
      </main>

      {/* Create / Edit Dialog overlay */}
      {isModalOpen && (
        <TaskModal
          task={editTask}
          onSave={handleSaveTask}
          onClose={() => {
            setIsModalOpen(false);
            setEditTask(null);
          }}
        />
      )}

      {/* Float Toasts notifications overlay */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
