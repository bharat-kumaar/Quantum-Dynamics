# Quantum Dynamics Backend (Enterprise Portal)

A robust, scalable, and secure backend RESTful API built for the Quantum Dynamics Enterprise Portal. This backend handles user authentication, project management, media uploads, team collaborations, and real-time dashboard metrics.

## 🚀 Key Features

*   **Secure Authentication:** JWT-based user login, signup, and session management.
*   **Role-Based Access Control (RBAC):** Secure middleware to protect admin and user-level routes.
*   **Project Management:** Create, read, update, and manage enterprise projects and their statuses.
*   **Media & Asset Handling:** File upload management with secure local storage (`/uploads`) and path traversal protection.
*   **Team Collaboration:** Manage team members, assign roles, and track contributions.
*   **Dashboard Analytics:** Aggregated metrics and data points for the frontend dashboard interface.

## 🛠️ Tech Stack

*   **Environment:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (with Mongoose ODM)
*   **Security:** JSON Web Tokens (JWT), bcrypt (Password Hashing)

## 📁 Project Structure

```text
quantum-be-bharat/
├── src/
│   ├── controllers/      # Route logic (auth, dashboard, media, project, team)
│   ├── middleware/       # Custom middlewares (authMiddleware, uploadMiddleware)
│   ├── models/           # Mongoose Database Schemas (user, project, asset)
│   └── routes/           # Express Route definitions
├── uploads/              # Local storage for user media/assets (Ignored in Git)
├── .env                  # Environment variables (Ignored in Git)
├── package.json          # Project dependencies
└── server.js             # Main application entry point