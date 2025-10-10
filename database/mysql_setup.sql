-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS teleprep_db;

-- Use the database
USE teleprep_db;

-- Create phone_data table
CREATE TABLE IF NOT EXISTS phone_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) NOT NULL UNIQUE,
    time VARCHAR(50) NOT NULL,
    ip VARCHAR(45) NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_created_at (created_at)
);
