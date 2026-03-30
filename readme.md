# Project & Task Manager

A full-stack web application for organizing work into projects and tasks. Each project contains a list of tasks that can be tracked as either pending or complete. The interface is split into two panels — select a project on the left to view and manage its tasks on the right. Edits and additions are done in a floating menu to ensure a seamless experience.

Built with Flask on the backend and React on the frontend, communicating over a REST API.

---

## Features

- Create, edit, and delete projects with a title and description
- Create, edit, and delete tasks within a project
- Tasks are categorized as **pending** or **complete**
- Toggle task status with a checkbox
- Floating modal forms — no page navigation required
- Tasks are automatically linked to the currently selected project

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite) |
| Backend | Python 3.12, Flask |
| Database | SQLite via Flask-SQLAlchemy |
| API | RESTful JSON over HTTP |
| Cross-origin | Flask-CORS |

---

## Prerequisites

Before getting started, make sure you have the following installed:

- **Python 3.12+** — [python.org](https://www.python.org/downloads/)
- **Node.js 18+ and npm** — [nodejs.org](https://nodejs.org/)
- **WSL** (Windows users only) — required to run the backend on Windows

To verify your versions:

```bash
python3 --version
node --version
npm --version
```

---

## Getting Started

The app has two parts that run simultaneously — a Flask backend and a React frontend. You will need **two terminal windows** open at the same time.

### Step 1 — Clone and navigate to the project

```bash
cd summative_2
```

### Step 2 — Set up the backend

In your first terminal:

```bash
# Create a virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Set up and seed the database with sample data
python seed.py

# Start the Flask server
python app.py
```

Flask will be running at `http://127.0.0.1:5000`.

> **Windows (WSL) users:** Flask must be started with `host="0.0.0.0"` to be reachable from your browser. In `app.py`, ensure the last line reads:
> ```python
> app.run(debug=True, host="0.0.0.0")
> ```

### Step 3 — Set up the frontend

In a **second terminal**:

```bash
cd summative_2/task-manager

# Install Node dependencies
npm install

# Start the React development server
npm run dev
```

The app will be available at `http://localhost:5173`.

> **Important:** Keep both terminal sessions running. Closing either one will take down that part of the app.

### Step 4 — Open the app

Navigate to `http://localhost:5173` in your browser. You should see two seeded projects with tasks already loaded. Select a project on the left to view its tasks on the right.

---

## Project Structure

```
summative_2/
├── app.py              # Flask app and route definitions
├── models.py           # SQLAlchemy data models
├── services.py         # Database CRUD operations
├── seed.py             # Script to reset and populate the database
├── requirements.txt    # Python dependencies
├── projects.db         # SQLite database file (auto-created on first run)
└── task-manager/       # React frontend
    └── src/
        ├── main.jsx
        └── TaskManager.jsx
```

---

## Data Models

### Project

| Field | Type | Required | Notes |
|---|---|---|---|
| id | Integer | — | Primary key, auto-incremented |
| title | String | Yes | Max 200 characters |
| description | Text | No | Freeform |
| created_at | DateTime | — | Set automatically on creation |
| updated_at | DateTime | — | Updated automatically on save |

### Task

| Field | Type | Required | Notes |
|---|---|---|---|
| id | Integer | — | Primary key, auto-incremented |
| project_id | Integer | — | Foreign key → projects.id |
| title | String | Yes | Max 200 characters |
| description | Text | No | Freeform |
| status | Enum | — | `pending` (default) or `complete` |
| created_at | DateTime | — | Set automatically on creation |
| updated_at | DateTime | — | Updated automatically on save |

Projects and tasks have a **one-to-many** relationship. Deleting a project permanently deletes all of its tasks.

---

## API Reference

All endpoints accept and return JSON. The base URL is `http://127.0.0.1:5000`.

### Projects

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects` | Return all projects |
| GET | `/projects/<id>` | Return a single project |
| POST | `/projects` | Create a new project |
| PATCH | `/projects/<id>` | Update a project's title or description |
| DELETE | `/projects/<id>` | Delete a project and all its tasks |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects/<id>/tasks` | Return tasks grouped by status |
| POST | `/projects/<id>/tasks` | Create a task under a project |
| PATCH | `/tasks/<id>` | Update a task's title or description |
| PATCH | `/tasks/<id>/toggle` | Toggle status between pending and complete |
| DELETE | `/tasks/<id>` | Delete a task |

### Request and response examples

```bash
# Create a project
curl -X POST http://127.0.0.1:5000/projects \
  -H "Content-Type: application/json" \
  -d '{"title": "Website Redesign", "description": "Overhaul the company site"}'

# Get all tasks for project 1, grouped by status
curl http://127.0.0.1:5000/projects/1/tasks

# Add a task to project 1
curl -X POST http://127.0.0.1:5000/projects/1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Write API docs", "description": "Document all endpoints"}'

# Toggle a task between pending and complete
curl -X PATCH http://127.0.0.1:5000/tasks/1/toggle
