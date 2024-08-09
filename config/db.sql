-- Enum for user roles
CREATE TYPE user_role AS ENUM ('EMPLOYEE', 'MANAGER', 'HRMANAGER');

-- Enum for leave statuses
CREATE TYPE leave_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    function VARCHAR(100),
    department VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL CHECK (email ~* '^[a-z]+\\.[a-z]+@avocarbon\\.com$'),
    password VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'EMPLOYEE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure unique email
CREATE UNIQUE INDEX idx_users_email ON users(email);


-- Leave requests table
CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20),
    leave_type VARCHAR(50) NOT NULL,
    request_date DATE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    justification TEXT,
    justification_file VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE leave_requests
ALTER COLUMN request_date SET DEFAULT CURRENT_DATE;
-- Mission requests table
CREATE TABLE mission_requests (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  phone VARCHAR(20) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  mission_budget DECIMAL(10, 2) NOT NULL,
  purpose_of_travel TEXT NOT NULL,
  destination VARCHAR(100) NOT NULL,
  departure_time TIME NOT NULL,
  supervisor_approval VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending',
  request_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Authorization requests table
CREATE TABLE authorization_requests (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  phone VARCHAR(20) NOT NULL,
  authorization_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  return_time TIME NOT NULL,
  purpose_of_authorization TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending',
  request_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS document_requests;

-- Create the new document_requests table
CREATE TABLE document_requests (
    id SERIAL PRIMARY KEY,                     
    employee_id INT NOT NULL,                  
    document_type VARCHAR(255) NOT NULL,       
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    status VARCHAR(50) DEFAULT 'Pending',      
    file_path VARCHAR(255),                    
    FOREIGN KEY (employee_id) REFERENCES users(id)  
   
);


--Modifications to add the relation between first approval and final approval 

--  Remove the default value from the column
ALTER TABLE users ALTER COLUMN role DROP DEFAULT;

--  Temporarily change the column type to TEXT
ALTER TABLE users ALTER COLUMN role TYPE TEXT USING role::TEXT;

--  Drop the old enum type
DROP TYPE user_role CASCADE;

--  Create the new enum type with the new value
CREATE TYPE user_role AS ENUM ('EMPLOYEE', 'MANAGER', 'HRMANAGER', 'PLANT_MANAGER');

-- Change the column type back to the new enum type
ALTER TABLE users ALTER COLUMN role TYPE user_role USING role::user_role;

-- Restore the default value to the column
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'EMPLOYEE';


