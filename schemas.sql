
-- ===============================
-- Database: HealthPoint
-- ===============================

DROP DATABASE IF EXISTS healthpoint;
CREATE DATABASE healthpoint;
USE healthpoint;

-- ===============================
-- Staff & Subtypes
-- ===============================

CREATE TABLE Staff (
  staff_id     INT PRIMARY KEY AUTO_INCREMENT,
  username     VARCHAR(50) UNIQUE NOT NULL,
  password     VARCHAR(100) NOT NULL,
  first_name   VARCHAR(50) NOT NULL,
  last_name    VARCHAR(50) NOT NULL,
  email        VARCHAR(100),
  role         ENUM('doctor', 'nurse', 'receptionist', 'labtechnician') NOT NULL
);

CREATE TABLE Doctor (
  staff_id     INT PRIMARY KEY,
  license_no   VARCHAR(50) NOT NULL,
  specialty    VARCHAR(100),
  schedule     TEXT,
  FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
);

-- ===============================
-- Patient
-- ===============================

CREATE TABLE Patient (
  patient_id   INT PRIMARY KEY AUTO_INCREMENT,
  username     VARCHAR(50) UNIQUE NOT NULL,
  password     VARCHAR(100) NOT NULL,
  first_name   VARCHAR(50) NOT NULL,
  last_name    VARCHAR(50) NOT NULL,
  email        VARCHAR(100),
  phone        VARCHAR(20),
  dob          DATE,
  gender       VARCHAR(20),
  insurance    VARCHAR(100),
  status       ENUM('inpatient', 'outpatient') DEFAULT 'outpatient',
  doctor_id    INT,
  FOREIGN KEY (doctor_id) REFERENCES Staff(staff_id)
);

-- ===============================
-- Room & Assignment
-- ===============================

CREATE TABLE Room (
  room_no    INT PRIMARY KEY,
  type       VARCHAR(50) NOT NULL,
  capacity   INT NOT NULL
);

CREATE TABLE RoomAssignment (
  room_no     INT,
  patient_id  INT,
  PRIMARY KEY (room_no, patient_id),
  FOREIGN KEY (room_no) REFERENCES Room(room_no),
  FOREIGN KEY (patient_id) REFERENCES Patient(patient_id)
);

-- ===============================
-- Appointment
-- ===============================

CREATE TABLE Appointment (
  appointment_id  INT PRIMARY KEY AUTO_INCREMENT,
  patient_id      INT NOT NULL,
  doctor_id       INT NOT NULL,
  date_time       DATETIME NOT NULL,
  length          INT NOT NULL,
  status          ENUM('Scheduled', 'Cancelled', 'Completed') DEFAULT 'Scheduled',
  FOREIGN KEY (patient_id) REFERENCES Patient(patient_id),
  FOREIGN KEY (doctor_id) REFERENCES Staff(staff_id)
);

-- ===============================
-- Bill
-- ===============================

CREATE TABLE Bill (
  bill_id        INT PRIMARY KEY AUTO_INCREMENT,
  patient_id     INT NOT NULL,
  appointment_id INT,
  amount         DECIMAL(10,2) NOT NULL,
  status         ENUM('Paid', 'Unpaid') DEFAULT 'Unpaid',
  description    VARCHAR(255) NOT NULL,
  issued_date    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES Patient(patient_id),
  FOREIGN KEY (appointment_id) REFERENCES Appointment(appointment_id)
);

-- ===============================
-- Triage (1:1 with Patient)
-- ===============================

CREATE TABLE Triage (
  patient_id   INT PRIMARY KEY,
  bp           VARCHAR(20) NOT NULL,
  heart_rate   INT NOT NULL,
  rating       VARCHAR(50) NOT NULL,
  FOREIGN KEY (patient_id) REFERENCES Patient(patient_id)
);

-- ===============================
-- Record
-- ===============================

CREATE TABLE Record (
  record_id   INT PRIMARY KEY AUTO_INCREMENT,
  patient_id  INT NOT NULL,
  doctor_id   INT NOT NULL,
  date        DATE NOT NULL,
  symptoms    TEXT NOT NULL,
  diagnosis   TEXT NOT NULL,
  notes       TEXT,
  FOREIGN KEY (patient_id) REFERENCES Patient(patient_id),
  FOREIGN KEY (doctor_id) REFERENCES Staff(staff_id)
);

-- ===============================
-- Test
-- ===============================

CREATE TABLE Test (
  test_id     INT PRIMARY KEY AUTO_INCREMENT,
  patient_id  INT NOT NULL,
  doctor_id   INT NOT NULL,
  labtech_id  INT,
  date        DATE NOT NULL,
  test_name   VARCHAR(100) NOT NULL,
  result      TEXT,
  FOREIGN KEY (patient_id) REFERENCES Patient(patient_id),
  FOREIGN KEY (doctor_id) REFERENCES Staff(staff_id),
  FOREIGN KEY (labtech_id) REFERENCES Staff(staff_id)
);

-- ===============================
-- Demo Data
-- ===============================

-- Staff
INSERT INTO Staff (username, password, first_name, last_name, email, role) VALUES
('house',     'doc123',    'Gregory', 'House',     'house@hp.com',    'doctor'),
('wilson',    'doc456',    'James',   'Wilson',    'wilson@hp.com',   'doctor'),
('nursejoy',  'nurse123',  'Joy',     'Smith',     'joy@hp.com',      'nurse'),
('reception1','rec123',    'Emma',    'Brown',     'emma@hp.com',     'receptionist'),
('labtech1',  'lab123',    'Leo',     'Green',     'leo@hp.com',      'labtechnician');

-- Doctor Subtype
INSERT INTO Doctor (staff_id, license_no, specialty, schedule) VALUES
(1, 'D12345', 'Diagnostics', '{"days":["Monday","Tuesday","Wednesday"],"startTime":"09:00","endTime":"17:00"}'),
(2, 'D67890', 'Oncology',    '{"days":["Monday","Wednesday","Friday"],"startTime":"10:00","endTime":"16:00"}');

-- Rooms
INSERT INTO Room (room_no, type, capacity) VALUES
(101, 'ICU', 1),
(102, 'Ward', 2),
(201, 'Waiting Room', 3);

-- Patients
INSERT INTO Patient (username, password, first_name, last_name, email, phone, dob, gender, insurance, status, doctor_id) VALUES
('patient1', 'pass123', 'John', 'Doe', 'john@hp.com', '555-1234', '1990-01-01', 'Male', 'Blue Cross', 'outpatient', 2),
('patient2', 'pass456', 'Alice', 'Smith', 'alice@hp.com', '555-5678', '1985-07-15', 'Female', 'Sun Life', 'inpatient', 1);

-- Room Assignments
INSERT INTO RoomAssignment (room_no, patient_id) VALUES (101, 2);

-- Triage
INSERT INTO Triage (patient_id, bp, heart_rate, rating) VALUES
(1, '120/80', 72, 'Stable'),
(2, '140/90', 88, 'Elevated');

-- Appointments
INSERT INTO Appointment (patient_id, doctor_id, date_time, length, status) VALUES
(1, 2, '2024-06-15 10:00:00', 30, 'Scheduled'),
(2, 1, '2024-06-16 09:30:00', 30, 'Scheduled');

-- Records
INSERT INTO Record (patient_id, doctor_id, date, symptoms, diagnosis, notes) VALUES
(1, 2, '2024-06-10', 'Cough, Fever', 'Flu', 'Prescribed rest.'),
(2, 1, '2024-06-12', 'Fatigue, Headache', 'Anemia', 'Ordered bloodwork');

-- Tests
INSERT INTO Test (patient_id, doctor_id, labtech_id, date, test_name, result) VALUES
(1, 2, 5, '2024-06-12', 'CBC', 'Normal'),
(2, 1, NULL, '2024-06-13', 'X-Ray', '');

-- Bills
INSERT INTO Bill (patient_id, appointment_id, amount, status, description) VALUES
(1, 1, 150.00, 'Unpaid', 'Consultation'),
(2, 2, 200.00, 'Paid', 'Follow-up');
