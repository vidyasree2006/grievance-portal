# 🎓 Student Grievance Portal

A full-stack MERN application that allows students to raise grievances, HODs to manage and resolve them, and admins to oversee the entire institution.

## 🚀 Live Demo
- Frontend: (add your Vercel URL after deployment)
- Backend: (add your Render URL after deployment)

## 👥 Roles
- **Student** — Raise grievances, track status, add comments
- **HOD** — View department grievances, update status, respond
- **Admin** — Full control, analytics dashboard, user management

## ✨ Features
- JWT Authentication with role-based access control
- Real-time status tracking with timeline
- Comment thread on each grievance
- Admin analytics dashboard with charts
- User management (promote/demote roles)
- Security hardened (token verification, forced student role on register)
- Responsive design with animations

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Redux Toolkit (state management)
- React Query (data fetching)
- React Hook Form (form handling)
- Tailwind CSS (styling)
- Recharts (analytics charts)
- Axios (API calls)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT + bcryptjs (authentication)
- Nodemailer (email notifications)
- Multer + Cloudinary (file uploads)
- Helmet + Rate limiting (security)

## 📁 Project Structure
grievance-portal/
├── backend/
│ ├── config/ # Database connection
│ ├── controllers/ # Route handlers
│ ├── middleware/ # Auth, error handler
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes
│ └── utils/ # Helper functions
└── frontend/
└── src/
├── api/ # Axios instance
├── components/ # Reusable components
├── pages/ # All pages by role
└── store/ # Redux store


## 🔧 Setup Instructions

### Backend
```bash
cd backend
npm install
# Create .env file with your values
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables (backend/.env)
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173


## 🔒 Security Features
- JWT tokens verified server-side on every request
- Role forced to student on self-registration
- Protected routes on both frontend and backend
- Helmet.js security headers
- Rate limiting (100 requests per 15 min)
- Input sanitization

## 📊 API Endpoints

### Auth
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- GET `/api/v1/auth/me`

### Grievances
- GET `/api/v1/grievances`
- POST `/api/v1/grievances`
- GET `/api/v1/grievances/:id`
- PUT `/api/v1/grievances/:id/status`
- DELETE `/api/v1/grievances/:id`

### Comments
- GET `/api/v1/comments/:grievanceId`
- POST `/api/v1/comments/:grievanceId`
- DELETE `/api/v1/comments/:id`

### Admin
- GET `/api/v1/admin/stats`
- GET `/api/v1/admin/users`
- PUT `/api/v1/admin/users/:id`
- DELETE `/api/v1/admin/users/:id`

## 👩‍💻 Developer
Built by **VidyaSree Sativada** — RGUKT IIIT Srikakulam
