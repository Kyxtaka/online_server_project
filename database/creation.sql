-- MariaDB database creation script
-- This script creates the database and the tables for the application

-- Drop the database if it exists
DROP DATABASE IF EXISTS `ONLINESERVICSEUTILITIESDB`;
-- Create the database  
CREATE DATABASE `ONLINESERVICESUTILITIESDB` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Use the created database
USE `ONLINESERVICESUTILITIESDB`;

-- Create the users table
CREATE TABLE IF NOT EXISTS `USERS` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `LIVECOMPUTER` (
    `macaddress` VARCHAR(17) NOT NULL PRIMARY KEY,
    `ipaddress` VARCHAR(45) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `hostname` VARCHAR(255) NOT NULL,
    `os` VARCHAR(50) NOT NULL,
    `network` VARCHAR(50) NOT NULL,
    `status` ENUM('online', 'offline') NOT NULL DEFAULT 'offline',
    `lastseen` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `USERCOMPUTERACCESS`(
    `email` VARCHAR(50) NOT NULL REFERENCES `USERS`(`email`) ON DELETE CASCADE,
    `macaddress` VARCHAR(17) NOT NULL REFERENCES `LIVECOMPUTER`(`macaddress`) ON DELETE CASCADE,
    `systemauthoritylevel` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    PRIMARY KEY (`email`, `macaddress`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
