# TaskFlow - Jira Inspired Project Management Dashboard

TaskFlow is a modern, responsive, full-stack MERN application designed to help teams track projects, manage tasks via a Kanban-style board, and collaborate effectively.

## Features

* **Authentication & Authorization**: Secure JWT-based authentication with role-based access control (Admin vs Employee).
* **Admin Dashboard**: Overview of all projects, tasks, and users with summary statistics.
* **Employee Dashboard**: Personalized view of assigned tasks and deadlines.
* **Project Management**: Create, update, and track multiple projects.
* **Kanban Task Board**: Interactive drag-and-drop task board to move tasks between "Todo", "In Progress", and "Done".
* **User Management**: Admins can view and remove users.
* **Modern UI**: Clean, responsive, and beautiful user interface built with React, Tailwind CSS v4, and HeroIcons.

## Tech Stack

**Frontend**:
* React.js (Vite)
* Tailwind CSS v4
* React Router DOM
* Axios
* React Icons

**Backend**:
* Node.js & Express.js
* MongoDB & Mongoose
* JSON Web Tokens (JWT)
* bcrypt (Password Hashing)

## Prerequisites

* Node.js (v18+ recommended)
* MongoDB (Local instance or Atlas URI)

## Getting Started

### 1. Clone the repository
(If applicable)

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=your_super_secret_key
```

Start the backend server:
```bash
npm start
# OR for development:
node server.js
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Usage
1. Open `http://localhost:5173` in your browser.
2. Register a new user. The first user will default to the 'Employee' role as per standard logic, but you can manually change the role to 'Admin' in your MongoDB database to test Admin features, or modify the User model default to 'Admin' temporarily.
3. As an Admin, create projects, add tasks, and assign them to users.
4. As an Employee, view your assigned tasks and update their status using the Kanban board.

## License
MIT
