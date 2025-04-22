-- MySQL-compatible schema for Hospital Management System
CREATE DATABASE IF NOT EXISTS hospital_db;
USE hospital_db;

-- Staff Table
CREATE TABLE Staff (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    uname VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    staff_type VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Doctor Table
CREATE TABLE Doctor (
    staff_id INT PRIMARY KEY,
    schedule VARCHAR(255),
    specialty VARCHAR(100),
    license_no VARCHAR(50),
    FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Nurse Table
CREATE TABLE Nurse (
    staff_id INT PRIMARY KEY,
    capacity INT,
    tending VARCHAR(100),
    FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Room Table
CREATE TABLE Room (
    room_no INT PRIMARY KEY,
    capacity INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Patient Table
CREATE TABLE Patient (
    patient_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    status VARCHAR(50),
    gender VARCHAR(10),
    insurance VARCHAR(100),
    phone VARCHAR(20),
    uname VARCHAR(100),
    password_hash VARCHAR(255),
    email VARCHAR(255),
    dob DATE,
    staff_id INT,
    room_no INT,
    FOREIGN KEY (staff_id) REFERENCES Doctor(staff_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (room_no) REFERENCES Room(room_no)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Triage Table
CREATE TABLE Triage (
    patient_id INT PRIMARY KEY,
    rating INT CHECK (rating BETWEEN 1 AND 10),
    bp VARCHAR(20),
    heart_rate INT,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Appointment Table
CREATE TABLE Appointment (
    app_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    staff_id INT,
    date_time DATETIME,
    length INT,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES Doctor(staff_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Record Table
CREATE TABLE Record (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    date DATE,
    history TEXT,
    symptoms TEXT,
    comments TEXT,
    height FLOAT,
    weight FLOAT,
    diagnosis TEXT,
    blood_type VARCHAR(5),
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bill Table
CREATE TABLE Bill (
    bill_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    itemized_list TEXT,
    charge FLOAT,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Test Table
CREATE TABLE Test (
    test_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    run_staff_id INT,
    order_staff_id INT,
    test_name VARCHAR(100),
    result TEXT,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (run_staff_id) REFERENCES Nurse(staff_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (order_staff_id) REFERENCES Doctor(staff_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tends Table
CREATE TABLE Tends (
    staff_id INT,
    patient_id INT,
    PRIMARY KEY (staff_id, patient_id),
    FOREIGN KEY (staff_id) REFERENCES Nurse(staff_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dummy Users for Testing
-- Hashed passwords below are bcrypt hashes of: pass123, doc123, nurse123, rec123, lab123
INSERT INTO Staff (staff_id, email, uname, password_hash, first_name, last_name, staff_type) VALUES
(1, 'doctor1@example.com', 'doctor1', '$2b$10$WmYvB8q3K1xkGZrYfKM2w.OCpYkRyZdE2OhzW3cq7oqCymES7kOyu', 'John', 'Doe', 'Doctor'),
(2, 'nurse1@example.com', 'nurse1', '$2b$10$QIPaQBGnU5eTjK1Z9Wfv/uvg0LVDnXZK1xjFFvMXplOYv1MBtGC7a', 'Jane', 'Smith', 'Nurse'),
(3, 'reception1@example.com', 'reception1', '$2b$10$VrJMPXo0UeRVUp1EjFczrOwjI6UaaJQaLweqYFRWNBMPNyzxWD6yG', 'Alice', 'Brown', 'Receptionist'),
(4, 'labtech1@example.com', 'labtech1', '$2b$10$O7o9aQsbx.NwPlxL1hqXK.Gfg4MZK6TWz8tYFzE3TbhKcJ/Zo8YVS', 'Bob', 'White', 'Lab Technician');

INSERT INTO Doctor (staff_id, schedule, specialty, license_no) VALUES
(1, 'Mon-Fri 9-5', 'General Medicine', 'LIC001');

INSERT INTO Nurse (staff_id, capacity, tending) VALUES
(2, 5, 'Ward A');

INSERT INTO Patient (patient_id, first_name, last_name, status, gender, insurance, phone, uname, password_hash, email, dob, staff_id, room_no) VALUES
(1, 'Tom', 'Taylor', 'Admitted', 'Male', 'HealthPlan', '1234567890', 'patient1', '$2b$10$EPrRj3r3r0k92c9N9Qmj0eSGY9.l0M.VE5IgEpjEvX50HYIfddYFi', 'patient1@example.com', '2000-01-01', 1, NULL);
