# 📋 Task Tracker: MERN Stack Task Tracker

A high-fidelity, production-grade **Task Tracker Web Application** built for the Full-Stack Developer Intern technical assessment at **COLL-EDGE CONNECT**. 

This application features a modern glassmorphic dashboard, real-time statistics, dynamic CRUD syncing, multi-faceted filtering/sorting, a subtask checklist manager, and dual-theme (Dark/Light) compatibility.

---

## 🌟 Core Features

- **📊 Visual Dashboard Stats**: Includes total tasks, pending tasks, completed tasks, and active urgent tasks alongside a custom-rendered SVG Circular Progress Ring that details completion percentages dynamically.
- **✨ Complete CRUD Operations**: Add, read, edit, delete tasks with instant React state updates (no page refreshes required).
- **📋 Subtask Checklist Builder**: Add individual checklist items inside tasks with interactive toggle states and visual subtask progress bars.
- **🔍 Advanced Search, Filtering & Sorting**:
  - Live query search for task titles and descriptions.
  - Search queries are **debounced (350ms)** to prevent database request spam.
  - Filter by Task Status (`To Do`, `In Progress`, `Completed`).
  - Filter by Task Priority (`Low`, `Medium`, `High`).
  - Filter by Task Category (automatic extraction of unique categories).
  - Sort by due date (soonest/furthest) or creation timestamp (newest/oldest).
- **🛡️ Complete Form Validations**: Strict verification on both frontend forms and backend mongoose models (e.g. title limits, minimum length validations) with explicit visual warning prompts.
- **🌓 Adaptive Theme Modes**: Fully responsive dark-glass theme (default) and clean light-glass theme, saving selection natively in `localStorage`.
- **✉️ Custom Toast Notification Manager**: Custom toast notifications (sliding alerts) mapping success, info, and database exception errors without relying on heavy third-party bundles.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (built on Vite), Vanilla CSS (Custom Design variables)
- **Backend**: Node.js + Express.js (Modular Route/Controller architecture, ES6 modules)
- **Database**: MongoDB + Mongoose ODM (Timestamps, validation schemas, query helpers)

---

## 📂 Project Architecture

```text
Task Tracker/
├── backend/
│   ├── config/
│   │   └── db.js            # MongoDB database connection pool
│   ├── controllers/
│   │   └── taskController.js# Express request-response handlers for tasks
│   ├── models/
│   │   └── Task.js          # Mongoose schema definitions (Tasks + Subtasks)
│   ├── routes/
│   │   └── taskRoutes.js    # REST API endpoints mappings
│   ├── .env                 # Environment variables
│   ├── package.json         # Backend dependencies & script definitions
│   └── server.js            # Express application entrypoint
│
└── frontend/
    ├── src/
    │   ├── assets/          # Project assets
    │   ├── components/
    │   │   ├── Dashboard.jsx# Stats cards & SVG circular progress ring
    │   │   ├── FilterBar.jsx# Search inputs, select filters, sort controllers
    │   │   ├── Header.jsx   # Top branding banner & theme toggler
    │   │   ├── TaskCard.jsx # Individual task display, progress-bar, metadata
    │   │   ├── TaskModal.jsx# Form overlay for Create/Edit task with validations
    │   │   └── Toast.jsx    # Alert notification containers
    │   ├── App.css          # Unused placeholder
    │   ├── App.jsx          # Central React states & REST requests
    │   ├── index.css        # Custom CSS variables, layout, animations
    │   └── main.jsx         # React application bootstrap
    ├── index.html           # HTML template injecting Outfit font
    └── package.json         # Frontend dependencies (React, Vite)
```

---

## ⚡ Setup & Run Locally

Ensure you have **Node.js** (v18+) and **MongoDB** (running locally or a MongoDB Atlas URI) ready.

### 1. Clone & Set Up Database
If you are running MongoDB locally, make sure the local daemon is active. If using MongoDB Atlas, obtain your connection string.

### 2. Configure Environment Variables
Inside `backend/`, look at or edit the `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/tasktracker
NODE_ENV=development
```

### 3. Spin up Backend Server
Open a terminal in the `backend/` directory:
```bash
# Install server dependencies
npm install

# Run the development server (runs nodemon)
npm run dev
```
The console will log:
`Server running in development mode on port 5000`
`MongoDB Connected: 127.0.0.1`

### 4. Spin up Frontend Development Server
Open a separate terminal in the `frontend/` directory:
```bash
# Install frontend packages
npm install

# Start Vite dev server
npm run dev
```
Open **`http://localhost:5173`** (or the port logged by Vite, e.g. `http://localhost:5174/`) in your browser to view the application.

---

## 📡 REST API Documentation

All HTTP requests expect JSON payloads and return JSON responses.

### Base Endpoint: `http://localhost:5000/api/tasks`

| Method | Endpoint | Query Parameters | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | `status`, `priority`, `category`, `search`, `sortBy`, `order` | Fetch tasks matching search query and filters |
| **GET** | `/:id` | None | Retrieve specific task by ObjectId |
| **POST** | `/` | None | Create new task (body validates title $\ge$ 3 chars) |
| **PUT** | `/:id` | None | Edit fields of task or update subtask completion array |
| **DELETE**| `/:id` | None | Delete a task permanently |

---

## 🚀 Deployment Playbook (Production Setup)

For recruiter review and deployment, the codebase is fully prepared:

1. **Database**: Provision a free cluster on [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database), retrieve connection string, and set it as `MONGODB_URI` in production.
2. **Backend**: Deploy the Node/Express backend to platforms like [Render](https://render.com/), [Railway](https://railway.app/), or [Heroku]. Add environment variable configurations:
   - `MONGODB_URI` = `mongodb+srv://...`
   - `PORT` = `10000` (Render handles this dynamically)
   - `NODE_ENV` = `production`
3. **Frontend**: Deploy the Vite React app to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
   - Add environment variables:
     - `VITE_API_URL` = `https://your-deployed-backend.onrender.com/api/tasks`
   - Set build command as `npm run build` and output folder as `dist`.
