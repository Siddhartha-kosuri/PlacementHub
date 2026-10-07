# PlacementHub – Cloud-Based Placement Management System

PlacementHub is a comprehensive full-stack placement management platform engineered with a modern multi-tier architecture, containerized relational data store, and cloud-ready service integrations. The platform automates campus placement workflows, bridging the gap between student job seekers and corporate recruiters through structured job tracking, profile management, automated resume parsing, and real-time recruitment metrics.

Designed as an end-to-end cloud computing case study, PlacementHub showcases enterprise software engineering patterns, including decoupled service layers, secure RESTful APIs, asynchronous event-driven triggers, containerization with Docker, and cloud-native integrations with the Microsoft Azure ecosystem.

---

## 📖 Overview

The campus placement process often involves disjointed workflows—students uploading unstandardized resumes, recruiters sifting through disparate applications, and placement officers struggling to maintain synchronized placement records. PlacementHub solves this by providing a unified, centralized web platform:

- **For Students**: A dedicated portal to register, maintain academic and skill profiles, upload resumes, discover relevant job openings from verified employers, track application progress in real-time, and view hiring status updates.
- **For Companies**: A corporate recruiter dashboard to post job vacancies, define skill prerequisites and salary packages, inspect applicant credentials, and advance candidates through a structured hiring pipeline (`applied` → `shortlisted` → `interview` → `offered` → `placed` / `rejected`).
- **For Placement Teams**: Automated platform analytics and aggregate statistics that capture hiring throughput, total active opportunities, applicant numbers, and placement conversion rates.

---

## ✨ Key Features

- 🎓 **Student Registration & Authentication**: Secure registration and token-based authentication (JWT) with password hashing via `bcrypt`.
- 🏢 **Company Portal & Job Management**: Recruiter registration, corporate authentication, job creation, and live job listing management.
- 👤 **Student Profile Management**: Interactive profile view and edit capabilities covering contact information, degree courses, graduation year, and technical skills.
- 💼 **Job Discovery & Search**: Keyword-based search and filtering enabling students to discover active job openings matching their skill profile.
- 📝 **Job Applications Pipeline**: Direct one-click application submission with duplicate application prevention and relationship tracking.
- 👥 **Applicant Review**: Company dashboard to inspect candidates per job posting with detailed applicant information and resume links.
- 🔄 **Application Status Updates**: Dynamic status progression with instant database synchronization and automated email notification dispatch hooks.
- 📊 **Placement Tracking & Statistics**: Real-time analytical dashboard displaying active jobs, registered students, participating companies, total applications, and placement records.
- 📄 **Resume Upload & Skill Extraction**: Multipart resume upload pipeline designed for cloud blob persistence and automated AI-driven technical skill extraction with local fallback support.
- 🔒 **Enterprise-Grade Security**: Layered security including Helmet HTTP protection headers, configurable Cross-Origin Resource Sharing (CORS), rate limiting on authentication routes, and parameterized SQL queries to prevent SQL injection.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios (configured with global request/response JWT interceptors)
- **Real-Time Client**: `@azure/web-pubsub-client`

### Backend
- **Runtime**: Node.js (v18+ / v20 LTS)
- **Framework**: Express.js
- **Architecture**: Modular RESTful API (Controllers, Middlewares, Services, Configuration singletons)
- **Security & Utilities**: `helmet`, `cors`, `morgan`, `express-rate-limit`, `jsonwebtoken`, `bcryptjs`, `multer`, `uuid`

### Database
- **Engine**: Microsoft SQL Server 2022
- **Driver**: `mssql` (Node.js native driver with connection pooling and TLS encryption)
- **Relational Tables**: `Students`, `Companies`, `Jobs`, `Applications`, `Placements`

### Development & Containerization
- **Containerization**: Docker & Docker Desktop
- **Database Image**: `mcr.microsoft.com/mssql/server:2022-latest`

### Cloud-Oriented Integrations (Microsoft Azure Ecosystem)
- **Compute**: Azure App Service (Linux Node.js web apps)
- **Relational Storage**: Azure SQL Database
- **Object Storage**: Azure Blob Storage (resumes container)
- **Document AI**: Azure AI Document Intelligence / Form Recognizer (automated resume parsing)
- **Intelligent Search**: Azure Cognitive Search (candidate skill and keyword search)
- **NoSQL / Chat Storage**: Azure Cosmos DB (Core SQL API for chat history)
- **In-Memory Caching**: Azure Cache for Redis
- **Real-Time Messaging**: Azure Web PubSub (bi-directional WebSocket communication)
- **Serverless Compute**: Azure Functions v4 (`ResumeProcessor` blob trigger)
- **Email Communications**: Azure Communication Services (ACS Email)
- **Push Notifications**: Azure Notification Hubs
- **Secrets Management**: Azure Key Vault
- **Monitoring & Telemetry**: Azure Application Insights & Log Analytics Workspace

---

## 🏗️ Architecture

The application follows a decoupled, multi-tier architectural pattern:

```text
Browser Client
      │
      ▼
React Frontend (SPA on Port 3000)
      │  REST API Calls (Proxied to Port 5000)
      ▼
Express.js Backend API Server (Port 5000)
      │
      ├─► Microsoft SQL Server (Docker / Azure SQL Database)
      │     └── Tables: Students, Companies, Jobs, Applications, Placements
      │
      └─► Cloud Services & Integrations (with Graceful Local Fallbacks)
            ├── Azure Blob Storage (Resume Files)
            ├── Azure AI Document Intelligence (Skill Extraction)
            ├── Azure Cognitive Search (Candidate Search)
            ├── Azure Cosmos DB (Chat Persistence)
            ├── Azure Web PubSub (WebSocket Real-Time Chat)
            └── Azure Communication Services (Email Notifications)
```

> **Note on Testing & Cloud Architecture**: The core PlacementHub application has been functionally verified using a local Dockerized SQL Server 2022 environment. All cloud service consumers are built with resilient fallback handlers, allowing local development and demonstration without requiring active Azure subscriptions.

---

## 📁 Project Structure

```text
PlacementHub/
├── backend/                       # Express.js REST API server
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # SQL Server connection pooling & Cosmos DB client
│   │   │   └── azure.js           # Azure SDK clients (Blob, Search, PubSub, Redis, AI)
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT verification & role-based authorization
│   │   ├── models/
│   │   │   └── sql-schema.sql     # Relational database DDL script
│   │   ├── routes/
│   │   │   ├── students.js        # Student registration, profile, jobs, applications
│   │   │   ├── companies.js       # Company auth, job posting, applicant management
│   │   │   ├── chat.js            # Chat messaging and Web PubSub token endpoints
│   │   │   └── placements.js      # Placement metrics and analytics endpoints
│   │   └── services/
│   │       ├── blobService.js     # Blob upload/delete with local fallback
│   │       ├── resumeService.js   # AI resume analysis and regex fallback parser
│   │       ├── searchService.js   # Cognitive search indexing and query fallback
│   │       ├── chatService.js     # Cosmos DB chat history and messaging
│   │       ├── emailService.js    # ACS Email notifications with console logger
│   │       └── notificationService.js # Azure Notification Hubs client
│   ├── init-db.js                 # Database schema initialization script
│   ├── server.js                  # Application entry point & middleware pipeline
│   ├── package.json               # Backend dependencies & npm scripts
│   └── .env.example               # Template for environment variables
├── frontend/                      # React Single Page Application (SPA)
│   ├── src/
│   │   ├── components/            # Shared UI components (e.g., Navbar)
│   │   ├── pages/
│   │   │   ├── student/           # Student pages (Login, Register, Dashboard, Jobs, Applications, Resume)
│   │   │   ├── company/           # Company pages (Login, Dashboard, PostJob, Applicants)
│   │   │   └── Chat.js            # Real-time chat interface
│   │   ├── services/
│   │   │   └── api.js             # Axios API client definitions
│   │   ├── App.js                 # React Router definitions & protected routes
│   │   └── index.js               # React DOM entry point
│   ├── package.json               # Frontend dependencies & scripts
│   └── public/                    # Static assets & HTML template
├── azure-functions/               # Serverless background processing
│   ├── ResumeProcessor/           # Blob trigger function for asynchronous resume analysis
│   │   ├── function.json          # Azure Function binding definitions
│   │   └── index.js               # Resume parsing & database update handler
│   ├── host.json                  # Azure Functions host configuration
│   └── package.json               # Function app dependencies
└── README.md                      # Comprehensive project documentation
```

---

## 📋 Prerequisites

Before running the application locally, ensure you have the following tools installed:

1. **Git**: [Download Git](https://git-scm.com/)
2. **Node.js**: Version 18+ or 20 LTS ([Download Node.js](https://nodejs.org/))
3. **npm**: Included with Node.js
4. **Docker Desktop**: [Download Docker Desktop](https://www.docker.com/products/docker-desktop/) (Ensure Docker engine is running)

---

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/Siddhartha-kosuri/PlacementHub.git
cd PlacementHub
```

---

### 2. Local Database Setup (Docker SQL Server)

PlacementHub utilizes Microsoft SQL Server 2022. If your Docker container `placementhub-sql` is already created, start it:

```bash
docker start placementhub-sql
```

If you are setting up SQL Server for the first time, create and launch the container using the official Microsoft SQL Server image:

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=<YOUR_STRONG_SQL_PASSWORD>" -p 1433:1433 --name placementhub-sql -d mcr.microsoft.com/mssql/server:2022-latest
```

*(Replace `<YOUR_STRONG_SQL_PASSWORD>` with a strong local database password).*

---

### 3. Backend Environment Configuration

Navigate to the `backend/` directory and create a `.env` file based on `.env.example`:

```bash
cd backend
cp .env.example .env
```

Configure your local database credentials in `backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=placementhub-local-dev-secret-key-change-in-prod

# Database Configuration (Docker SQL Server)
AZURE_SQL_SERVER=localhost
AZURE_SQL_DATABASE=placementhub
AZURE_SQL_USER=sa
AZURE_SQL_PASSWORD=<YOUR_STRONG_SQL_PASSWORD>

# Optional Azure Services (Leave blank for local fallbacks)
AZURE_STORAGE_CONNECTION_STRING=
AZURE_STORAGE_CONTAINER=resumes
AZURE_FORM_RECOGNIZER_ENDPOINT=
AZURE_FORM_RECOGNIZER_KEY=
AZURE_SEARCH_ENDPOINT=
AZURE_SEARCH_KEY=
AZURE_SEARCH_INDEX=candidates
AZURE_WEB_PUBSUB_CONNECTION_STRING=
AZURE_WEB_PUBSUB_HUB=chat
COSMOS_DB_ENDPOINT=
COSMOS_DB_KEY=
REDIS_CONNECTION_STRING=
AZURE_COMMUNICATION_CONNECTION_STRING=
```

---

### 4. Install Backend Dependencies & Initialize Schema

From the `backend/` directory:

```bash
# Install exact dependencies
npm ci

# Initialize relational database tables
node init-db.js
```

You should see: `Schema initialized successfully!`

---

### 5. Start the Backend API Server

```bash
# Start with auto-reload (nodemon)
npm run dev
```

- **API Base URL**: `http://localhost:5000`
- **Health Check Endpoint**: `http://localhost:5000/health` (Expected response: `{"status":"ok","service":"PlacementHub API"}`)

---

### 6. Install Frontend Dependencies & Start React Client

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm ci

# Start the React development server
npm start
```

- **Frontend Client**: `http://localhost:3000`

---

## 🔄 Running the Complete System

To run PlacementHub, ensure services are started in the following order:

1. **Docker SQL Server**: `docker start placementhub-sql`
2. **Express Backend**: `cd backend && npm run dev` (Port 5000)
3. **React Frontend**: `cd frontend && npm start` (Port 3000)

---

## 🎯 Main User Workflow

The platform follows a verified end-to-end recruitment lifecycle:

```text
1. Company Registration & Login
   └── Recruiter registers company and accesses corporate dashboard.
2. Job Posting
   └── Company posts a new vacancy (e.g., Software Engineer Intern, skills, openings).
3. Student Discovery & Application
   └── Student logs in, browses matching vacancies, and submits an application.
4. Recruiter Applicant Review
   └── Company views applicant list for the posted job, reviewing candidate profiles and resumes.
5. Application Status Progression
   └── Company transitions application status (e.g., 'applied' → 'shortlisted' → 'offered').
6. Student Notification & Verification
   └── Student applications dashboard dynamically reflects status changes in real-time.
7. Placement Analytics Updates
   └── Platform-wide statistics automatically update to reflect candidate placement metrics.
```

---

## ☁️ Cloud Computing Relevance

PlacementHub serves as a practical implementation of fundamental cloud computing and enterprise architectural principles:

- **Multi-Tier Decoupled Architecture**: Separation of presentation (React SPA), application logic (Express REST API), and data tiers (SQL / NoSQL).
- **Containerization**: Use of Docker containers ensuring consistent, reproducible database environments across development and production.
- **Microservices & REST Design**: Stateless endpoints communicating via standard JSON payloads with JWT session management.
- **Cloud Object Storage**: Offloading heavy binary assets (PDF resumes) to scalable object storage rather than database tables.
- **Cloud AI Services Integration**: Automating document analysis through specialized Machine Learning APIs (Azure Document Intelligence).
- **Serverless & Event-Driven Processing**: Background execution triggered by object storage lifecycle events (`ResumeProcessor` Function).
- **Polyglot Persistence**: Combining relational data (Azure SQL for structured users and jobs) with document stores (Cosmos DB for high-throughput messaging).
- **Cloud Security Best Practices**: Least-privilege role management, parameterized queries, encrypted TLS transport, and centralized Key Vault secret references.

---

## 🌐 Azure Services Breakdown

| Azure Service | Architecture Role | Local Execution Mode |
| :--- | :--- | :--- |
| **Azure SQL Database** | Primary relational store for user entities, jobs, and applications | Executed via Docker SQL Server 2022 |
| **Azure Blob Storage** | Unstructured storage for student resume documents | Local fallback (`local://resumes/...`) |
| **Azure AI Document Intelligence** | Automated ML extraction of technical skills from resumes | Local regex-based keyword parser fallback |
| **Azure Cognitive Search** | Full-text candidate search and indexing | Gracefully returns empty results set (`[]`) |
| **Azure Cosmos DB** | NoSQL store for real-time chat message history | In-memory message object fallback |
| **Azure Cache for Redis** | High-speed cache for session state and rate-limiting | In-memory `express-rate-limit` fallback |
| **Azure Web PubSub** | Bi-directional WebSocket communication service | Requires active Azure subscription token |
| **Azure Functions** | Asynchronous blob-triggered resume processing | Background serverless code provided in `azure-functions/` |
| **Azure Communication Services** | Automated transactional email status notifications | Formatted HTML logged directly to server console |
| **Azure Notification Hubs** | Multi-platform mobile/web push notifications | Non-blocking warning fallback |
| **Azure Key Vault** | Secure secrets and connection string management | Local `.env` file for local development |

---

## 🧪 Verified Local Testing

All core application features have undergone strict end-to-end verification in the local environment:

- ✅ **Backend Health Endpoint**: Verified `200 OK` on `/health`.
- ✅ **Frontend Compilation**: Verified development compilation and production webpack build (`npm run build`).
- ✅ **Database Connectivity & Relational Integrity**: Verified table schemas and foreign key constraints across `Students`, `Companies`, `Jobs`, `Applications`, and `Placements`.
- ✅ **Student Lifecycle**: Registration, JWT login, profile editing, job browsing, job search filtering, and application submission.
- ✅ **Company Lifecycle**: Registration, JWT login, job posting, applicant listing inspection, and application status updates (`shortlisted`, `placed`).
- ✅ **Resume Pipeline Fallback**: Multipart file upload handling, fallback URI generation, regex skill extraction, and profile database updating.
- ✅ **Analytics Engine**: Real-time aggregate metric calculation across students, companies, jobs, applications, and placed candidates.

---

## ⚠️ Current Limitations

1. **Local Development Scope**: The current validation was conducted locally using Dockerized SQL Server 2022 to guarantee reproducible testing without requiring cloud service billing.
2. **Real-Time Web PubSub**: The WebSocket chat module relies on Azure Web PubSub for client connection tokens; without an active cloud service, chat token generation returns an unconfigured status.
3. **Serverless Cloud Trigger**: The Azure Function in `azure-functions/` is designed for live Azure Blob triggers; in the local environment, resume processing is handled synchronously by the Express backend API.

---

## 🔧 Troubleshooting

| Issue | Cause | Resolution |
| :--- | :--- | :--- |
| **Cannot connect to database** | Docker container is stopped or credentials mismatch | Run `docker start placementhub-sql` and ensure `AZURE_SQL_PASSWORD` in `backend/.env` matches container password |
| **Port 3000 / 5000 already in use** | A previous Node.js process is still listening | Run `netstat -ano \| findstr :5000` (Windows) or `lsof -i :5000` (Linux/Mac) and terminate the PID |
| **`backend/.env` missing** | Configuration file not created | Copy `backend/.env.example` to `backend/.env` and configure local values |
| **CORS error on API calls** | Frontend URL mismatch | Ensure `FRONTEND_URL=http://localhost:3000` is defined in `backend/.env` |
| **Module not found during startup** | Incomplete dependency installation | Run `npm ci` in both `backend/` and `frontend/` directories |

---

## 📄 License & Academic Notice

This project was developed as an academic and technical case study for Cloud Computing. It is provided for educational, research, and portfolio demonstration purposes.
