-- MariaDB database creation script
-- This script creates the database and the tables for the application

-- Drop the database if it exists
DROP DATABASE IF EXISTS `SERVMANAGEMENT`;
-- Create the database  
CREATE DATABASE `SERVMANAGEMENT` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Use the created database
USE `SERVMANAGEMENT`;

-- Create the users table
CREATE TABLE IF NOT EXISTS `USERS` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `COMPUTERS` (
    `macAddress` VARCHAR(17) NOT NULL PRIMARY KEY,
    `localV4IpAddress` VARCHAR(50) NOT NULL,
    `v6IpAddress` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `hostname` VARCHAR(255) NOT NULL,
    `os` VARCHAR(50) NOT NULL,
    `status` ENUM('ONLINE', 'OFFLINE', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
    `lastseen` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `USERCOMPUTERRIGHTS`(
    `email` VARCHAR(50) NOT NULL REFERENCES `USERS`(`email`) ON DELETE CASCADE,
    `macAddress` VARCHAR(17) NOT NULL REFERENCES `COMPUTERS`(`macAddress`) ON DELETE CASCADE,
    `systemAuthorityLevel` ENUM('ADMIN', 'FRIENDS', 'GUEST') NOT NULL DEFAULT 'GUEST',
    PRIMARY KEY (`email`, `macAddress`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
