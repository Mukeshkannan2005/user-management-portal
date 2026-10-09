# User Management Portal

A full-stack web application built using Angular, Node.js, TypeScript, Express.js, and MongoDB. The application provides role-based login and user management features through a responsive dashboard.

## Project Overview

The User Management Portal allows users to log in based on their assigned role. General Users can view their permitted user records, while Administrators can manage user accounts through the dashboard.

This project demonstrates frontend development, REST API integration, database operations, asynchronous data loading, and modular application architecture.

## Features

- **Role-Based Login:** Separate access for Admin and General Users.
- **User Dashboard:** Displays user information and records.
- **User Management:** Administrators can add and delete user records.
- **REST API Integration:** Connects the Angular frontend to the Node.js backend.
- **MongoDB Database:** Stores user information.
- **Password Hashing:** Uses bcrypt for password hashing and comparison.
- **Role-Based Filtering:** Retrieves records according to the requested user role and ID.
- **Asynchronous Data Loading:** Supports configurable API response delays.
- **Responsive Interface:** Login page and dashboard with custom CSS styling.

## Technologies Used

| Category | Technologies |
|---|---|
| Frontend | Angular, HTML, CSS, TypeScript |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB |
| API | REST API, HTTP requests |
| Security | bcrypt password hashing |
| Development Tools | Visual Studio Code, Git, GitHub |

## Project Structure

```text
user-management-portal/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── user.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── public/
├── src/
│   ├── app/
│   │   ├── login/
│   │   ├── dashboard/
│   │   └── services/
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
└── README.md
```

## Prerequisites

Install the following before running the application:

- Node.js and npm
- Angular CLI compatible with the project
- MongoDB Community Server
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Mukeshkannan2005/user-management-portal.git
cd user-management-portal
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure MongoDB

Make sure your MongoDB server is running. The application is configured to use a local MongoDB database.

Verify the database connection settings in the backend source before running the application.

### 5. Start the Backend

From the `backend` directory, run:

```bash
npx tsx src/server.ts
```

The backend API runs at:

`http://localhost:3000`

### 6. Start the Angular Frontend

Open another terminal in the project root directory and run:

```bash
ng serve
```

Open the application in your browser:

`http://localhost:4200`

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend health |
| POST | `/api/login` | Authenticate login credentials |
| GET | `/api/users` | Retrieve user records |
| POST | `/api/users` | Add a user |
| DELETE | `/api/users/:userId` | Delete a user |

## Demo Login Credentials

Use the following demo accounts to explore the application's role-based features.

| Role | User ID | Password |
|---|---|---|
| General User | `user001` | `user123` |
| Admin | `admin001` | `admin123` |



## Learning Outcomes

- Building an Angular single-page application.
- Developing REST APIs with Node.js and Express.js.
- Integrating a frontend with a backend.
- Performing CRUD operations with MongoDB.
- Implementing role-based UI behavior and data filtering.
- Organizing code into reusable services and modules.

## Future Improvements

- Implement server-side authentication and authorization for all protected API routes.
- Add token-based authentication and session management.
- Improve input validation and error handling.
- Add automated unit and integration tests.
- Deploy the frontend and backend to cloud hosting.

## Author

**Mukeshkannan**

GitHub: [Mukeshkannan2005](https://github.com/Mukeshkannan2005)

---

This project was developed to practise full-stack web development and build practical software engineering skills.
