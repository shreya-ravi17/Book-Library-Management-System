# 📚 Book Library Management System

A full-stack MERN application where users can sign up, log in, and manage a library of books: add, search, edit, delete, and mark books as **Available** or **Issued**.

**🌐 Live App:** https://booklibrary-management-system.netlify.app
**⚙️ Backend API:** https://book-library-management-system-x41f.onrender.com

> The backend runs on Render's free plan, so the first request after a period of inactivity can take up to ~50 seconds to wake up.

---

## ✨ Features

- Sign up and log in with user records stored in MongoDB
- Add books with title, author, category, and availability status
- View all books and search by title or author
- Edit and delete book records
- Mark books as Available or Issued
- Dashboard with live stats (total, available, issued, categories)
- "Collection" page with a bookshelf view, filters, and sorting
- Responsive design for desktop and mobile

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Security | bcryptjs (password hashing), CORS |
| Deployment | Netlify (frontend), Render (backend) |

## 📁 Project Structure

```
Book-Library-Management-System/
├── backend/
│   ├── models/          # User and Book Mongoose models
│   ├── routes/          # auth.js and books.js
│   └── server.js
└── frontend/
    ├── public/          # _redirects for Netlify
    └── src/
        ├── components/  # Sidebar
        ├── pages/       # Login, Signup, Dashboard, Collection
        ├── utils/
        └── api.js       # Axios instance using VITE_API_URL
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create a new account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/books` | Get all books (supports `?search=`) |
| POST | `/api/books` | Add a book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |

## 🚀 Run Locally

### Prerequisites
- Node.js (v18 or later)
- A MongoDB Atlas account (or a local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/shreya-ravi17/Book-Library-Management-System.git
cd Book-Library-Management-System
```

### 2. Set up the backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
```

Start the server:
```bash
npm run dev
```

### 3. Set up the frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Optionally create `frontend/.env` (defaults to `http://localhost:5000`):
```env
VITE_API_URL=http://localhost:5000
```

Open **http://localhost:5173** in your browser.

## 🔐 Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `MONGODB_URI` | Backend | MongoDB Atlas connection string |
| `PORT` | Backend | Server port (set automatically on Render) |
| `CLIENT_URL` | Backend | Frontend URL allowed by CORS |
| `VITE_API_URL` | Frontend | Backend base URL |

## ☁️ Deployment

**Backend (Render)**
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGODB_URI`, `CLIENT_URL`

**Frontend (Netlify)**
- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist`
- Environment variable: `VITE_API_URL` (the Render backend URL)
- `public/_redirects` makes page refreshes work with React Router
