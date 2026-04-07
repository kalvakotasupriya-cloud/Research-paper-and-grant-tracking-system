# Research Paper and Grant Tracking System

## Overview
A full-stack web application for managing research papers, grant applications, reviews, and progress reports in academic institutions.

## Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | REST API server |
| MySQL | Relational database |
| JWT | Authentication |
| bcrypt | Password hashing |
| express-session | Session tracking |
| cookie-parser | Cookie management |
| express-validator | Input validation |
| morgan | Request logging |
| express-rate-limit | Rate limiting |
| cors | Cross-origin requests |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React + Vite | Frontend framework |
| React Router v6 | Client-side routing |
| Bootstrap 5 | Responsive UI |
| Axios | HTTP client |
| Chart.js + react-chartjs-2 | Data visualization |

## Project Structure
research-tracker/
├── research-tracker-backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── db_setup.sql
│   ├── server.js
│   ├── .env.example
│   └── postman_collection.json
├── research-tracker-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── index.html
└── README.md

## Roles
| Role | Access |
|------|--------|
| researcher | Submit papers, apply grants, submit reports |
| admin | Approve/reject papers and grants, manage all |
| reviewer | Review and comment on submitted papers |
| funding_authority | View-only access to grants and reports |

## Setup Instructions

### Prerequisites
- Node.js v18+
- MySQL 8.0+
- Git

### 1. Clone Repository
git clone https://github.com/YOUR_USERNAME/research-tracker.git
cd research-tracker

### 2. Backend Setup
cd research-tracker-backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials

### 3. Database Setup
# Open MySQL Workbench or CLI
mysql -u root -p
source db_setup.sql

### 4. Start Backend
npm run dev
# Runs on http://localhost:5000

### 5. Frontend Setup
cd ../research-tracker-frontend
npm install

### 6. Start Frontend
npm run dev
# Runs on http://localhost:5173

## API Documentation
Import any of these into Postman:
- postman_collection.json           (basic)
- postman_collection_fixed.json     (with test scripts)
- postman_collection_strict.json    (strict contract testing)

See POSTMAN_TESTING_GUIDE.md for full instructions.

## Experiment Coverage
| Experiment | Technology | Where Used |
|-----------|-----------|------------|
| 1 | HTML/CSS3/Flex/Grid | Frontend layouts |
| 2 | Bootstrap 5 | All pages |
| 3 | JS Validation | All forms |
| 4 | ES6 async/await | All services |
| 5 | MySQL CRUD | All controllers |
| 6 | XML/DTD/XSD | (see /xml folder) |
| 7 | Servlet → DB | Express controllers |
| 8 | Cookies/Session | authMiddleware |
| 9 | Node http module | server.js |
| 10 | Express REST API | All routes |
| 11 | JWT Auth | authMiddleware |
| 12 | React Router | App.jsx |
| 13 | Chart.js weather | AdminDashboard |
| 14 | React TODO deploy | GitHub deployment |

## Seed Users (for testing)
| Email | Password | Role |
|-------|---------|------|
| admin@research.com | password123 | admin |
| researcher@research.com | password123 | researcher |
| reviewer@research.com | password123 | reviewer |
| funding@research.com | password123 | funding_authority |
