# FACULTY CAREER ADVANCEMENT & PUBLICATION SUMMARY GENERATOR

> A centralized institutional web application designed for higher education faculty and academic administrators. It maintains comprehensive academic portfolios, tracks research output and publications, provides real-time analytics, and automatically compiles dynamic, audit-ready **Career Advancement Summaries** and **Publication Summaries** directly from MongoDB.

---

## 📌 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Architecture](#architecture)
5. [Folder Structure](#folder-structure)
6. [Prerequisites](#prerequisites)
7. [Installation & Setup](#installation--setup)
8. [Database Seeding (Demo Data)](#database-seeding-demo-data)
9. [Running the Application](#running-the-application)
10. [REST API Documentation](#rest-api-documentation)
11. [Demo Credentials](#demo-credentials)
12. [Security & Validation](#security--validation)
13. [Future Enhancements](#future-enhancements)

---

## 📖 Project Overview
Academic institutions face recurring overhead when preparing documents for faculty appraisal, annual performance reviews, research documentation, and accreditation inspections (e.g., NAAC, NBA, NIRF). Faculty members often juggle fragmented spreadsheets, email threads, and paper documents.

This web application resolves that by offering:
- **Centralized Faculty Dossier**: Personal, academic, and professional details in one secure portal.
- **Complete Academic Modules**: Publications (Journals, Conferences, Books, Patents), Honors & Awards, Certifications, Conferences & FDPs, and Sponsored Research Projects.
- **Automated Career Advancement Summary**: A dynamically aggregated, formal appraisal dossier that compiles data across all modules into an audit-ready format.
- **Publication Analytics & Summary Generator**: Real-time aggregation showing Scopus/Web of Science/UGC indexing distribution, publication types, and multi-year publication trends.
- **Institutional Admin Oversight**: Comprehensive directory, department-level statistics, and institution-wide research output tracking.

---

## ✨ Key Features

### 👨‍🏫 Faculty Features
- **User Authentication**: Secure registration and JWT-based login with bcrypt password encryption.
- **Dynamic Dashboard**: Real-time KPI counters (Publications, Journals, Conferences, Achievements, Certifications, Projects), interactive distribution charts, and a balanced Academic Progress Summary.
- **Faculty Profile Management**: Update qualifications, specialization, research interests, ORCID, Google Scholar, and LinkedIn handles.
- **Publication Management**:
  - Full CRUD operations (Add, Edit, View, Delete with confirmation modal).
  - Search across Title, Author, Journal, and DOI.
  - Multi-attribute filtering by Publication Type, Indexing (Scopus, Web of Science, UGC, etc.), Status, and Year.
- **Achievements & Honors**: Track institutional, state, national, and international awards with verification links.
- **Certifications & Licensures**: Manage professional certifications, issuing organizations, credential IDs, and expiry dates.
- **Conferences & Workshops**: Track event participation as Speaker, Presenter, Session Chair, or Organizer.
- **Sponsored Research Projects**: Maintain PI/Co-PI details, funding organizations, grant amounts, and execution timelines.
- **Automated Career Advancement Summary**:
  - One-click dossier generation aggregating all active database records.
  - Print & Save as PDF support with dedicated `@media print` CSS styling.
- **Publication Summary Generator**:
  - Dynamic MongoDB aggregation of indexing metrics (Scopus, Web of Science, UGC).
  - Yearly publication velocity visualization.

### 🛡️ Admin Features
- **Admin Dashboard**: College-wide analytics, department-wise faculty counts, and total research output.
- **Faculty Directory**: Search faculty members by name, employee ID, department, or designation.
- **Individual Portfolio Inspection**: View any faculty member's profile, generated career summary, and publication metrics.
- **Institution-Wide Publications View**: Inspect publication activity across all departments.

---

## 💻 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, Axios, Lucide React (Icons), Modern Vanilla CSS |
| **Backend** | Node.js (v18+), Express.js (RESTful API), MVC Architecture |
| **Database** | MongoDB (v6+), Mongoose (v8 ODM) |
| **Security** | JWT (JSON Web Tokens), Bcrypt.js (Salted password hashing), CORS |
| **Build & Tooling** | Vite v5, Nodemon, Dotenv |

---

## 🏛 Architecture

The application implements a decoupled, modern client-server architecture:

```
┌────────────────────────────────────────────────────────┐
│                   React.js Frontend                    │
│  (React Router, Context API, Axios Client, Print CSS)   │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON (JWT in Header)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Express.js Backend                   │
│  (Auth Middleware, Role Authorization, Error Handling) │
└─────────────┬───────────────────────────┬──────────────┘
              │                           │
              ▼                           ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│     Controllers & Utils   │ │      Mongoose Models      │
│  (Summary Aggregation,    │ │  (User, Faculty, Pubs,   │
│   Search & Query Filters) │ │   Achievements, Projects) │
└─────────────┬─────────────┘ └───────────┬───────────────┘
              │                           │
              └─────────────┬─────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                    MongoDB Database                    │
│   (Indexed collections, Aggregation Pipelines)        │
└────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
d:/FSD PROJECT/
├── backend/
│   ├── config/
│   │   └── db.js                     # MongoDB connection via Mongoose
│   ├── controllers/
│   │   ├── achievementController.js  # Achievement CRUD handlers
│   │   ├── adminController.js        # Admin analytics and faculty directory
│   │   ├── authController.js         # Register, login, session inspection
│   │   ├── certificationController.js# Certification CRUD
│   │   ├── conferenceController.js   # Conferences & workshops CRUD
│   │   ├── facultyController.js      # Faculty profile management
│   │   ├── projectController.js       # Research projects CRUD
│   │   ├── publicationController.js  # Publications CRUD & filtering
│   │   └── summaryController.js      # Career summary & publication aggregations
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT verification & faculty association
│   │   ├── errorMiddleware.js        # Centralized 404 & 500 error handlers
│   │   └── roleMiddleware.js         # Role-based access control (RBAC)
│   ├── models/
│   │   ├── Achievement.js            # Achievement schema & indexes
│   │   ├── Certification.js          # Certification schema
│   │   ├── Conference.js             # Conference & workshop schema
│   │   ├── Faculty.js                # Faculty profile schema
│   │   ├── Project.js                # Research projects schema
│   │   ├── Publication.js            # Publication schema & indexes
│   │   └── User.js                   # User auth schema & bcrypt pre-save hook
│   ├── routes/
│   │   ├── achievementRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── certificationRoutes.js
│   │   ├── conferenceRoutes.js
│   │   ├── facultyRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── publicationRoutes.js
│   │   └── summaryRoutes.js
│   ├── utils/
│   │   └── generateSummary.js        # Career dossier formatting helper
│   ├── .env.example
│   ├── app.js                        # Express app and route registrations
│   ├── package.json
│   ├── seed.js                       # Comprehensive database seed script
│   └── server.js                     # HTTP server startup
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AchievementCard.jsx   # Card display for achievements
│   │   │   ├── DashboardCard.jsx     # KPI metric display card
│   │   │   ├── Loading.jsx           # Clean loading spinner state
│   │   │   ├── Modal.jsx             # Accessible modal dialog
│   │   │   ├── Navbar.jsx            # Top navbar with user pill & logout
│   │   │   ├── ProfileCard.jsx       # Academic profile preview card
│   │   │   ├── ProtectedRoute.jsx    # Role-based route guard
│   │   │   ├── PublicationCard.jsx   # Publication card with metadata badges
│   │   │   └── Sidebar.jsx           # Responsive navigation drawer
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Authentication & user state provider
│   │   │   └── ToastContext.jsx      # Feedback notifications provider
│   │   ├── pages/
│   │   │   ├── Achievements.jsx      # Achievements CRUD page
│   │   │   ├── AddPublication.jsx    # Add / Edit publication form
│   │   │   ├── AdminDashboard.jsx    # College-wide statistics & analytics
│   │   │   ├── CareerSummary.jsx     # Formal career dossier (Print/PDF)
│   │   │   ├── Certifications.jsx    # Certifications CRUD page
│   │   │   ├── Conferences.jsx       # Conferences & workshops CRUD
│   │   │   ├── Dashboard.jsx         # Faculty dashboard & overview
│   │   │   ├── FacultyList.jsx       # Admin faculty directory
│   │   │   ├── Login.jsx             # Login with 1-click demo presets
│   │   │   ├── NotFound.jsx          # Context-aware 404 page
│   │   │   ├── Profile.jsx           # Faculty profile editor
│   │   │   ├── Projects.jsx          # Sponsored projects CRUD
│   │   │   ├── PublicationSummary.jsx# Dynamic publication metrics & charts
│   │   │   ├── Publications.jsx      # Searchable & filterable publications
│   │   │   ├── Register.jsx          # Faculty account registration
│   │   │   └── Settings.jsx          # Account settings & credentials update
│   │   ├── services/
│   │   │   └── api.js                # Centralized Axios client with JWT interceptor
│   │   ├── styles/
│   │   │   └── index.css             # Design tokens, components & @media print
│   │   ├── utils/
│   │   │   ├── formatters.js         # Date & currency formatting helpers
│   │   │   └── validation.js         # Input validation helpers
│   │   ├── App.jsx                   # React Router routing layout
│   │   └── main.jsx                  # React DOM root entry
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Prerequisites
Ensure the following are installed on your machine:
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **MongoDB**: Local MongoDB community server (listening on default port `27017`) or MongoDB Atlas URI

---

## 🚀 Installation & Setup

### 1. Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Install backend dependencies
npm install

# Create environment configuration
# Copy .env.example to .env (if not already present)
cp .env.example .env
```

Ensure `backend/.env` contains:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/faculty_career_db
JWT_SECRET=faculty_career_super_secret_jwt_key_2026_secure
NODE_ENV=development
```

### 2. Frontend Setup
```bash
# Navigate to the frontend directory
cd ../frontend

# Install frontend dependencies
npm install

# Create environment configuration
cp .env.example .env
```

Ensure `frontend/.env` contains:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🗄️ Database Seeding (Demo Data)
To populate the database with complete, realistic demo records (Admin + 3 Faculty across Computer Science, Electronics, and Mechanical Engineering with peer-reviewed publications, awards, certifications, and grants):

```bash
# From backend directory
cd backend
npm run seed
```

Output:
```
[Seed] Connected to database
[Seed] Cleared existing records
[Seed] Admin user created: admin@college.edu / Admin@123
[Seed] Database seeded successfully!
```

---

## 🏃 Running the Application

### Option A: Run in Two Separate Terminals

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Frontend starts on http://localhost:5173
```

Open your browser and navigate to: **`http://localhost:5173`**

---

## 🔑 Demo Credentials

For quick evaluation during project presentation or review, the login page provides **1-Click Login buttons**, or you can manually enter:

| Role | Name | Department | Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Faculty** | Dr. Rajesh Kumar | CSE | `dr.rajesh@college.edu` | `Faculty@123` |
| **Faculty** | Dr. Priya Sharma | ECE | `dr.priya@college.edu` | `Faculty@123` |
| **Faculty** | Dr. Anand Verma | MECH | `dr.anand@college.edu` | `Faculty@123` |
| **Admin** | System Academic Dean | Administration | `admin@college.edu` | `Admin@123` |

---

## 📡 REST API Documentation

All protected routes expect the `Authorization` header formatted as: `Bearer <JWT_TOKEN>`.

### Authentication Endpoints
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user & initialize faculty record | Public |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT | Public |
| `GET` | `/api/auth/me` | Fetch active user profile and linked faculty ID | Private |

### Faculty Profile Endpoints
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/faculty/profile` | Retrieve profile of authenticated faculty | Private (Faculty) |
| `PUT` | `/api/faculty/profile` | Update profile information | Private (Faculty) |
| `GET` | `/api/faculty/:id` | View faculty profile by ID | Private |

### Publications Endpoints
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/publications` | Search, filter, sort & paginate publications | Private |
| `POST` | `/api/publications` | Add a new publication | Private (Faculty) |
| `GET` | `/api/publications/:id` | Get single publication details | Private |
| `PUT` | `/api/publications/:id` | Update existing publication | Private (Faculty) |
| `DELETE` | `/api/publications/:id` | Delete publication | Private (Faculty) |

### Achievements Endpoints
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/achievements` | List achievements with search & filters | Private |
| `POST` | `/api/achievements` | Add new achievement | Private (Faculty) |
| `PUT` | `/api/achievements/:id` | Update achievement record | Private (Faculty) |
| `DELETE` | `/api/achievements/:id` | Delete achievement record | Private (Faculty) |

### Certifications, Conferences & Projects Endpoints
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET/POST` | `/api/certifications` | List / Add certifications | Private |
| `PUT/DELETE`| `/api/certifications/:id` | Update / Delete certification | Private (Faculty) |
| `GET/POST` | `/api/conferences` | List / Add conferences & FDPs | Private |
| `PUT/DELETE`| `/api/conferences/:id` | Update / Delete conference record | Private (Faculty) |
| `GET/POST` | `/api/projects` | List / Add research projects | Private |
| `PUT/DELETE`| `/api/projects/:id` | Update / Delete research project | Private (Faculty) |

### Summaries & Analytics Endpoints
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/summary/dashboard` | Aggregated counts, charts & recent entries | Private (Faculty) |
| `GET` | `/api/summary/career` | Aggregated institutional appraisal dossier | Private |
| `GET` | `/api/summary/publications`| Indexing & type breakdown metrics | Private |

### Admin Endpoints
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/faculty` | Directory of all faculty with counts | Private (Admin) |
| `GET` | `/api/admin/statistics` | College-wide metrics and charts | Private (Admin) |
| `GET` | `/api/admin/publications` | Filterable list of all institutional papers | Private (Admin) |

---

## 🔒 Security & Validation
- **Password Security**: Bcrypt with 10 salt rounds before persistence. Passwords are never returned in queries (`select: false`).
- **Authorization Guard**: Role-based access control (`faculty` vs `admin`). Faculty members cannot alter or delete each other's records.
- **Input Validation**: Rigorous checks on emails, password complexity, date ranges, DOI formats, and required academic fields.
- **CORS Protection**: Restricted origins and headers configured in Express.
- **XSS & Injection Mitigation**: Strict JSON body parsing and parameterized Mongoose ODM queries.

---

## 🔮 Future Enhancements
- Automated BibTeX / DOI fetcher via Crossref and PubMed APIs.
- AI-driven publication classification and keyword extraction.
- Institutional appraisal committee approval workflow.
- Single Sign-On (SSO) integration with Google Workspace and Microsoft 365.
- Export summaries to Microsoft Word (.docx) format.

---

## 📄 License
This project is developed for academic evaluation purposes as a Full Stack Development (FSD) Capstone Project.
