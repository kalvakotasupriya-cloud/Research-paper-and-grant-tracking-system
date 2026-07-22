# Research Paper and Grant Tracking System

A full-stack web application for managing research paper submissions, grant applications, reviews, and research progress in academic institutions.

---

## Features

- User authentication using JWT
- Role-based access control
- Research paper submission and review workflow
- Grant application management
- Progress report tracking
- RESTful APIs
- Interactive dashboards with Chart.js
- Responsive user interface

---

## Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API Server |
| MySQL | Relational Database |
| JWT | Authentication |
| bcrypt | Password Hashing |
| express-session | Session Management |
| cookie-parser | Cookie Management |
| express-validator | Input Validation |
| morgan | Request Logging |
| express-rate-limit | API Rate Limiting |
| cors | Cross-Origin Requests |

### Frontend

| Technology | Purpose |
|------------|---------|
| React + Vite | Frontend Framework |
| React Router v6 | Client-side Routing |
| Bootstrap 5 | Responsive UI |
| Axios | API Communication |
| Chart.js | Data Visualization |

---

## Project Structure

```text
Research-paper-and-grant-tracking-system/
│
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
│
├── research-tracker-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── index.html
│
└── README.md
```

---

## User Roles

| Role | Permissions |
|------|-------------|
| Researcher | Submit research papers, apply for grants, upload progress reports |
| Reviewer | Review submitted papers and provide feedback |
| Admin | Manage users, approve papers and grants |
| Funding Authority | View grant applications and reports |

---

## Prerequisites

Before running the project, ensure you have:

- Node.js (v18 or later)
- MySQL (v8.0 or later)
- Git

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/kalvakotasupriya-cloud/Research-paper-and-grant-tracking-system.git
cd Research-paper-and-grant-tracking-system
```

### 2. Backend Setup

```bash
cd research-tracker-backend
npm install
cp .env.example .env
```

Update the `.env` file with your MySQL credentials.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=research_tracker

JWT_SECRET=your_secret_key
```

### 3. Database Setup

Open MySQL Workbench or MySQL CLI and execute:

```bash
mysql -u root -p
source db_setup.sql
```

### 4. Start the Backend

```bash
npm run dev
```

Backend runs at:

```
http://localhost:5000
```

### 5. Frontend Setup

```bash
cd ../research-tracker-frontend
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## API Testing

Import any of the following collections into Postman:

- `postman_collection.json`
- `postman_collection_fixed.json`
- `postman_collection_strict.json`

Refer to `POSTMAN_TESTING_GUIDE.md` for detailed API testing instructions.

---

## Demo Accounts

| Email | Password | Role |
|--------|----------|------|
| admin@research.com | password123 | Admin |
| researcher@research.com | password123 | Researcher |
| reviewer@research.com | password123 | Reviewer |
| funding@research.com | password123 | Funding Authority |

---

## License

This project is licensed under the MIT License.

---

## Author

**Sai Supriya Kalvakota**

- GitHub: https://github.com/kalvakotasupriya-cloud
- LinkedIn: https://www.linkedin.com/in/kalvakota-sai-supriya-b11888321/
