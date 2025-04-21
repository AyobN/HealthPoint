

CREATE TABLE staff (
    staff_id  INT PRIMARY KEY , 
    email VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    uname VARCHAR(50) NOT NULL,
    pass VARCHAR(50) NOT NULL,
    staff_type VARCHAR(50) NOT NULL
); -- usage of varchar so mix of letters and numbers; one table as the other tables will be child tables/one parent table to; not null to prevent empty values which might cause errors

-- child table for doctors
CREATE TABLE doctor(
    staff_id INT PRIMARY KEY,
    schedule VARCHAR(50) UNIQUE NOT NULL,
    scpecialty VARCHAR(50) NOT NULL,
    license_no UNIQUE INT NOT NULL,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);  

CREATE TABLE nurse (
    staff_id INT PRIMARY KEY NOT NULL,
    capacity INT,
    tending VARCHAR(50),
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

-- new table for patient to avoid confusion in code or when using application;
CREATE TABLE patient (
    patient_id INT PRIMARY KEY ,
    f_name VARCHAR(50) NOT NULL,
    l_name VARCHAR(50) NOT NULL,
    status VARCHAR(10) NOT NULL,
    gender VARCHAR(2) NOT NULL,
    insurance VARCHAR(15), -- covers patient with no insurance
    phone INT NOT NULL,
    uname VARCHAR(50) NOT NULL,
    pass VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    dob DATE,
    staff_id INT NOT NULL,
    room_no INT,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id);
)


CREATE TABLE tends(
    staff_id INT NOT NULL,
    patient_id INT NOT NULL,
    PRIMARY KEY(staff_id, patient_id),
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id),
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id) ,
) -- composite key as each pat



CREATE TABLE triage(
    patient_id INT NOT NULL;
    rating INT NOT NULL CHECK(rating BETWEEN 1 AND 5), -- 1 being not urgent and 5 being immediate care
    bp VARCHAR(10),
    heart_rate INT NOT NULL, -- i hope you understand if this is null we killed the patient, GOOD JOB!!
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id) 
);

CREATE TABLE bill(
    bill_id INT PRIMARY KEY,
    patient_id INT NOT NULL,
    itemized_list TEXT,
    charge DECIMAL(10,2),
    FOREIGN KEY (patient_id) REFERENCES patient (patient_id)
);

CREATE TABLE appointment(
    app_id INT PRIMARY KEY,
    patient_id INT,
    staff_id INT,
    date_time TEXT,
    length INT,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (staff_id) REFRENCES staff(staff_id),
);

CREATE TABLE record(
    record_id INT PRIMARY KEY,
    patient_id INT,
    date DATE,
    history VARCHAR(350),
    symptoms VARCHAR(350),
    comments VARCHAR(350),
    height DECIMAL (1,1),
    weight DECIMAL (3,2),
    diagnosis VARCHAR(350),
    blood_type VARCHAR(3),
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
);

CREATE TABLE room(
    room_id INT PRIMARY KEY,
    capacity INT
);


CREATE TABLE test(
    test_id INT PRIMARY KEY,
    patient_id INT,
    run_staff_id INT,
    order_staff_id INT,
    test_name VARCHAR(50),
    result VARCHAR(350),
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
);