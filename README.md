# HealthPoint

HealthPoint is a full-stack Hospital Management System developed as a course project for CPSC 471.

## Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: MySQL (to be integrated)
- Communication: REST API (JSON format)
- Ports:
  - Frontend: http://localhost:3000
  - Backend: http://localhost:6969

## Features Implemented

### Login System

- Single login page with two options: Patient Login and Staff Login
- Credentials validated using dummy user data on the backend
- Role detection is handled server-side for staff (e.g., doctor, nurse, receptionist)
- Users are redirected to a role-specific view after successful login

### Role-Based Views

Each user role is directed to their own minimal view component:

- PatientView: Displays upcoming appointments, assigned medical staff, and billing information (placeholder content)
- DoctorView: Displays assigned patients, records, test results, and appointments (placeholder content)
- NurseView: Displays list of assigned patients and triage data (placeholder content)
- ReceptionistView: Allows booking and rescheduling of appointments and viewing doctor availability (placeholder content)
- LabTechView: Displays and manages test orders and results (placeholder content)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/HealthPoint.git
cd HealthPoint
```

### 2. Set Up the Backend

```bash
cd server
npm install
node index.js
```

Backend will be running at http://localhost:6969

### 3. Set Up the Frontend

```bash
cd ../client
npm install
npm start
```

Frontend will be available at http://localhost:3000

## Dummy User Accounts

Use the following credentials to test the login system:

| Role           | Username   | Password |
| -------------- | ---------- | -------- |
| Patient        | patient1   | pass123  |
| Doctor         | doctor1    | doc123   |
| Nurse          | nurse1     | nurse123 |
| Receptionist   | reception1 | rec123   |
| Lab Technician | labtech1   | lab123   |

## Next Steps

- Connect to MySQL database and implement schema
- Build dynamic views for each role
- Add appointment booking and record management
- Implement authentication and session management
- Add stored procedures for key workflows

## Authors

Group 77
