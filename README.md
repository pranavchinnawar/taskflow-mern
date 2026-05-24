# TaskFlow: A Jira-Inspired Project Management Platform

## 📋 Overview

**TaskFlow** is a modern, full-stack enterprise-grade project and task management dashboard designed to streamline team collaboration. Heavily inspired by industry-standard Agile workflows like Atlassian Jira, TaskFlow features a highly interactive drag-and-drop Kanban board, role-based access control, and a premium "Glassmorphism" UI powered by Tailwind CSS and Framer Motion.

This project was built entirely from scratch using the MERN stack (MongoDB, Express.js, React, Node.js).

## ✨ Core Features

* 🔐 **Secure Authentication**: JWT-based stateless authentication with `bcrypt` password hashing.
* 🛡️ **Role-Based Access Control (RBAC)**: Distinct user experiences for **Admin** (Project/User management) and **Employee** (Task execution).
* 📊 **Smart Dashboard**: High-level statistical overview and recent activity tracking.
* 📁 **Project Management**: Create, track, and manage multiple concurrent workspaces.
* 📋 **Interactive Kanban Board**: Drag-and-drop task progression between "Todo", "In Progress", and "Done" states.
* 🎨 **Premium UI/UX**: Custom dark-mode aesthetic featuring deep glassmorphism panels, fluid micro-animations (Framer Motion), and modern typography (Plus Jakarta Sans).

## 🛠️ Technology Stack

**Frontend Architecture:**
* React 18 (Bootstrapped with Vite)
* Tailwind CSS v4 (Custom dark theme)
* Framer Motion (Fluid animations and page transitions)
* React Router DOM (Protected Routing)
* Axios (API interceptors for JWT injection)

**Backend Architecture:**
* Node.js & Express.js (REST API design)
* MongoDB & Mongoose (Schema validation and relational references)
* JSON Web Tokens (Security)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
* Node.js (v18.x or higher)
* MongoDB (Local instance running, or an Atlas Cluster URI)
* Git

### 1. Clone the repository
```bash
git clone https://github.com/pranavchinnawar/taskflow-mern.git
cd taskflow-mern
```

### 2. Backend Setup
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the following variables:
```env
PORT=5000
# Replace with your MongoDB Atlas URI if not using local MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/taskflow 
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend server:
```bash
# Starts on http://localhost:5000
npm start 
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
# Starts on http://localhost:5173
npm run dev
```

---

## 💡 Usage Guide & Testing

1. Navigate to `http://localhost:5173` in your browser.
2. Register a new user account. 
3. **Important Note on Roles:** By default, new users are assigned the `Employee` role. To test administrative features (like creating projects and viewing the full user directory), you must manually change your user's role to `Admin` directly in your MongoDB database using MongoDB Compass or Atlas.
4. As an Admin, create a new workspace (Project) and populate it with issues (Tasks).
5. Open the project details to experience the drag-and-drop Kanban workflow.


