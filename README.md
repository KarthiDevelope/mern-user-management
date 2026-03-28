# 🛠️ UserManager — MERN Stack User Management App

A full-stack **Mini SaaS User Management** application built with the **MERN stack** (MongoDB, Express, React, Node.js), featuring JWT authentication, role-based access control, and a clean Ant Design UI.

---

## 📸 Features

### Authentication
- ✅ Signup & Login with JWT
- ✅ Protected routes (frontend + backend)
- ✅ Token stored in `localStorage`, auto-attached via Axios interceptors
- ✅ Auto-logout on token expiry (401 response)

### Role-Based Access Control
| Feature | Admin | User |
|---|---|---|
| View all users | ✅ | ❌ |
| Add new user | ✅ | ❌ |
| Edit any user | ✅ | ❌ |
| Delete user | ✅ | ❌ |
| View own profile | ❌ | ✅ |
| Edit own profile | ❌ | ✅ |

### Dashboard
- Admin: Stats cards (total users, admins, regular users) + recent users list
- User: Profile overview card

### User Management (Admin)
- Search by name or email (debounced)
- Filter by role (Admin / User)
- Pagination with configurable page size
- Add / Edit / Delete users via modal
- Cannot delete your own account

---

## 🗂️ Project Structure

```
mern-user-management/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # signup, login, getMe
│   │   └── userController.js   # CRUD + profile
│   ├── middleware/
│   │   ├── auth.js             # protect & authorize
│   │   ├── errorHandler.js     # global error handler
│   │   └── validation.js       # express-validator rules
│   ├── models/
│   │   └── User.js             # Mongoose schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── token.js            # JWT helpers
│   ├── seed.js                 # Database seeder
│   ├── server.js               # Express entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js        # Axios instance + interceptors
│   │   │   ├── auth.js         # Auth API calls
│   │   │   └── users.js        # Users API calls
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── layout/
│   │   │   │   └── AppLayout.jsx
│   │   │   └── users/
│   │   │       └── UserFormModal.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   └── UsersPage.jsx
│   │   │   ├── user/
│   │   │   │   └── ProfilePage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
├── package.json                # Root scripts
└── README.md
```

---

## ⚙️ Prerequisites

Make sure you have the following installed:
- **Node.js** v18+ — [Download](https://nodejs.org)
- **MongoDB** v6+ — [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://cloud.mongodb.com)
- **Git** — [Download](https://git-scm.com)

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/mern-user-management.git
cd mern-user-management
```

### 2. Configure Backend Environment

```bash
cd backend
cp .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI="mongodb+srv://karthiofficial15:usermgmt@user-mgmt.6jl7rmo.mongodb.net/?appName=user-mgmt"
JWT_SECRET="afcf2b7c55ea8cd618fde5720c989b718c5149edb91608ac4bcf7f30aa1200b23f3a9ede05b0d7ce817d2e98e49666f6478b85401e97b2a44445f0b42cb5a17d"
JWT_EXPIRES_IN=7d
NODE_ENV="development"
CLIENT_URL="http://localhost:5173"
```

> 💡 For **MongoDB Atlas**, replace `MONGO_URI` with your connection string:
> `mongodb+srv://<user>:<password>@cluster.mongodb.net/user-management`

### 3. Install Dependencies

From the **root** directory:

```bash
npm install
npm run install:all
```

Or manually:

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 4. Seed the Database (Optional but Recommended)

```bash
npm run seed
```

This creates the following demo accounts:

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@example.com      | admin123  |
| User  | alice@example.com      | user1234  |
| User  | bob@example.com        | user1234  |
| Admin | eve@example.com        | user1234  |

### 5. Run the Application

**Run both backend and frontend together:**

```bash
npm run dev
```

Or run separately in two terminals:

```bash
# Terminal 1 — Backend (port 5000)
npm run dev:backend

# Terminal 2 — Frontend (port 3000)
npm run dev:frontend
```

### 6. Open in Browser

```
http://localhost:5173
```


```frontend env
FRONTEND ENV ----> VITE_API=http://localhost:5000/api
```
---

## 🔌 API Reference

### Auth Endpoints

| Method | Endpoint          | Access  | Description         |
|--------|-------------------|---------|---------------------|
| POST   | `/api/auth/signup`| Public  | Register new user   |
| POST   | `/api/auth/login` | Public  | Login & get token   |
| GET    | `/api/auth/me`    | Private | Get logged-in user  |

### User Endpoints

| Method | Endpoint              | Access       | Description              |
|--------|-----------------------|--------------|--------------------------|
| GET    | `/api/users`          | Admin        | List all users (+ search, pagination) |
| POST   | `/api/users`          | Admin        | Create a new user        |
| GET    | `/api/users/:id`      | Admin        | Get user by ID           |
| PUT    | `/api/users/:id`      | Admin        | Update user              |
| DELETE | `/api/users/:id`      | Admin        | Delete user              |
| GET    | `/api/users/profile`  | Any Auth     | Get own profile          |
| PUT    | `/api/users/profile`  | Any Auth     | Update own profile       |

### Query Parameters (GET /api/users)

| Param    | Type   | Description                        |
|----------|--------|------------------------------------|
| `search` | string | Search by name or email            |
| `role`   | string | Filter by `admin` or `user`        |
| `page`   | number | Page number (default: 1)           |
| `limit`  | number | Items per page (default: 10, max: 50) |

---

## 🧰 Tech Stack

### Backend
| Package              | Purpose                         |
|----------------------|---------------------------------|
| Express.js           | Web framework                   |
| Mongoose             | MongoDB ODM                     |
| bcryptjs             | Password hashing                |
| jsonwebtoken         | JWT auth                        |
| express-validator    | Input validation                |
| express-async-errors | Async error propagation         |
| morgan               | HTTP request logging            |
| cors                 | Cross-origin resource sharing   |
| dotenv               | Environment variables           |

### Frontend
| Package              | Purpose                         |
|----------------------|---------------------------------|
| React 18             | UI library                      |
| React Router v6      | Client-side routing             |
| Ant Design 5         | UI component library            |
| Axios                | HTTP client                     |

---

## 🔒 Security Highlights

- Passwords hashed with **bcrypt** (salt rounds: 12) via Mongoose pre-save hook
- JWT verified on every protected request via middleware
- Role authorization enforced at **route level** in the backend
- Admin cannot delete their own account (UI + backend guard)
- Input validated with `express-validator` before hitting controllers
- Global error handler catches and formats all errors consistently

---

## 📝 Environment Variables

| Variable       | Description                          | Default                    |
|----------------|--------------------------------------|----------------------------|
| `PORT`         | Backend server port                  | `5000`                     |
| `MONGO_URI`    | MongoDB connection string            | (required)                 |
| `JWT_SECRET`   | Secret key for signing JWTs          | (required, use strong key) |
| `JWT_EXPIRES_IN` | JWT expiry duration               | `7d`                       |
| `NODE_ENV`     | Environment (`development`/`production`) | `development`          |

---

## 🏗️ Build for Production

```bash
# Build the React frontend
npm run build

# The built files will be in frontend/build/
# Serve them via Express or a static host (Vercel, Netlify, etc.)
```

---

## 👨‍💻 Author

**Karthikeyan** — MERN Stack Developer Task Submission  
Built as part of the technical interview process.
