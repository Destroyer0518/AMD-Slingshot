-- Enable UUID extension for uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Patients Table
CREATE TABLE IF NOT EXISTS Patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    date_of_birth DATE NOT NULL,
    phone VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Doctors Table
CREATE TABLE IF NOT EXISTS Doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    specialty VARCHAR NOT NULL,
    current_status VARCHAR NOT NULL CHECK (current_status IN ('Available', 'In Surgery', 'Off Duty')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Appointments Table (The Junction Table)
CREATE TABLE IF NOT EXISTS Appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES Patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES Doctors(id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR NOT NULL CHECK (status IN ('Scheduled', 'Completed', 'Cancelled')),
    reason_for_visit TEXT
);

-- ==============================================================================
-- Constraint Rule Note for Appointments:
-- To strictly prevent double-booking a doctor for overlapping times on the same date,
-- we use the PostgreSQL EXCLUDE constraint (requires btree_gist extension).
--
-- Setup instructions to apply this constraint:
-- 1. CREATE EXTENSION IF NOT EXISTS btree_gist;
-- 2. ALTER TABLE Appointments 
--    ADD CONSTRAINT prevent_doctor_double_booking 
--    EXCLUDE USING gist (
--      doctor_id WITH =, 
--      appointment_date WITH =, 
--      timerange(start_time, end_time) WITH &&
--    );
-- ==============================================================================

-- 4. Medical_History Table
CREATE TABLE IF NOT EXISTS Medical_History (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES Patients(id),
    doctor_id UUID NOT NULL REFERENCES Doctors(id),
    appointment_id UUID UNIQUE NOT NULL REFERENCES Appointments(id),
    clinical_notes TEXT NOT NULL,
    prescriptions JSONB, -- Cleanly stores arrays of medication names and dosages
    created_at TIMESTAMP DEFAULT NOW()
);
