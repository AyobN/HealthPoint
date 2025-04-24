# HealthPoint

HealthPoint is a full-stack Hospital Management System developed as a final project for CPSC 471. The system models key workflows in a hospital setting, with role-based access for patients, doctors, nurses, receptionists, and lab technicians. It is fully backed by a MySQL relational database and structured around a clean React.js interface.

## Stack

- **Frontend:** React.js
- **Backend:** Node.js with Express
- **Database:** MySQL (fully integrated)
- **Communication:** REST API (JSON format)

### Ports
- Frontend: http://localhost:3000  
- Backend: http://localhost:6969

---

## Features

### Login System

- Single login page with Patient or Staff login
- Hardcoded user credentials per role (stored in the database)
- Role detection is handled server-side
- Users are redirected to role-specific dashboards

---

### Role-Based Portals

#### PatientView
- View assigned doctor
- View upcoming appointments
- View billing history and payment status

#### DoctorView
- View assigned patients and their room
- View and record patient medical records
- Order and review lab tests
- View upcoming appointments

#### NurseView
- View assigned patients
- Record or update triage data (blood pressure, heart rate, rating)

#### ReceptionistView
- Manage doctors and patients
- Admit/discharge patients to/from rooms
- Schedule, reschedule, and cancel appointments
- View doctor availability
- Create and edit bills, mark as paid/unpaid
- Search for bills by patient or bill ID

#### LabTechView
- View pending lab tests ordered by doctors
- Submit test results
- View completed tests with patient and doctor info

---

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

Backend API will run at: http://localhost:6969

### 3. Set Up the Frontend

```bash
cd ../client
npm install
npm start
```

Frontend app will be available at: http://localhost:3000

---

## Dummy User Accounts (From SQL Seed Data)

These accounts are stored in the database and reflect the seeded users:

| Role           | Username     | Password |
| -------------- | ------------ | -------- |
| Patient        | patient1     | pass123  |
| Patient        | patient2     | pass456  |
| Doctor         | house        | doc123   |
| Doctor         | wilson       | doc456   |
| Nurse          | nursejoy     | nurse123 |
| Receptionist   | reception1   | rec123   |
| Lab Technician | labtech1     | lab123   |
| Lab Technician | labtech2     | lab456   |

---

## Notes

- Data is stored in a MySQL schema designed to model key hospital workflows
- Role-based views enforce workflow separation but do not implement secure authentication
- Room capacity and doctor availability are dynamically calculated
- All frontend components are modular and designed for clarity and ease of use

---

## Authors

Group 77  
CPSC 471 - Winter 2025  
