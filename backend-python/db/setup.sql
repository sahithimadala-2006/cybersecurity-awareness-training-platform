-- Run in MySQL Workbench as a MySQL administrator.
-- Existing cyberaware database and its data are preserved.
CREATE DATABASE IF NOT EXISTS cyberaware CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'cyberaware_app'@'localhost' IDENTIFIED BY 'cyberaware_local_dev';
ALTER USER 'cyberaware_app'@'localhost' IDENTIFIED BY 'cyberaware_local_dev';
GRANT ALL PRIVILEGES ON cyberaware.* TO 'cyberaware_app'@'localhost';
FLUSH PRIVILEGES;
