
-- ============================================================
-- Smart ATM Banking Management System - Database Setup
-- ============================================================

DROP DATABASE IF EXISTS atm_database;

CREATE DATABASE atm_database
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE atm_database;

-- ============================================================
-- Table: customers
-- ============================================================

CREATE TABLE customers (
    customer_id   INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    phone_number  VARCHAR(15)
) ENGINE=InnoDB;

-- ============================================================
-- Table: accounts
-- ============================================================

CREATE TABLE accounts (
    account_id      INT AUTO_INCREMENT PRIMARY KEY,
    customer_id     INT NOT NULL,
    account_number  VARCHAR(20) UNIQUE NOT NULL,
    atm_card_number VARCHAR(16) UNIQUE NOT NULL,
    pin             VARCHAR(4) NOT NULL,
    account_type    ENUM('Savings','Current') DEFAULT 'Savings',
    balance         DECIMAL(12,2) DEFAULT 0.00,

    FOREIGN KEY (customer_id)
    REFERENCES customers(customer_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- Table: transactions
-- ============================================================

CREATE TABLE transactions (
    transaction_id    VARCHAR(20) PRIMARY KEY,
    account_id        INT NOT NULL,
    transaction_type  ENUM('Deposit','Withdrawal') NOT NULL,
    amount            DECIMAL(12,2) NOT NULL,
    transaction_date  DATETIME DEFAULT CURRENT_TIMESTAMP,
    remaining_balance DECIMAL(12,2) NOT NULL,

    FOREIGN KEY (account_id)
    REFERENCES accounts(account_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- Sample Data: 10 Customers
-- ============================================================

INSERT INTO customers (customer_name, phone_number) VALUES
('Aishwarya', '9876543210'),
('Priya Patel', '8765432109'),
('Amit Verma', '7654321098'),
('Rahul Sharma', '9876543211'),
('Kavitha', '9876543212'),
('Divya', '9876543213'),
('Ramya', '9876543214'),
('Harini', '9876543215'),
('Keerthana', '9876543216'),
('Sneha', '9876543217');

-- ============================================================
-- Sample Data: 10 Accounts
-- ============================================================

INSERT INTO accounts
(customer_id, account_number, atm_card_number, pin, account_type, balance)
VALUES
(1, 'ACC0001001', '1234567890123456', '1234', 'Savings', 50000.00),
(2, 'ACC0002001', '1234567890123457', '2345', 'Current', 75000.00),
(3, 'ACC0003001', '1234567890123458', '3456', 'Savings', 25000.00),
(4, 'ACC0004001', '1234567890123459', '4567', 'Savings', 40000.00),
(5, 'ACC0005001', '1234567890123460', '5678', 'Current', 60000.00),
(6, 'ACC0006001', '1234567890123461', '6789', 'Savings', 35000.00),
(7, 'ACC0007001', '1234567890123462', '7890', 'Savings', 55000.00),
(8, 'ACC0008001', '1234567890123463', '8901', 'Current', 30000.00),
(9, 'ACC0009001', '1234567890123464', '9012', 'Savings', 70000.00),
(10, 'ACC0010001', '1234567890123465', '1122', 'Savings', 20000.00);

-- ============================================================
-- Sample Transactions
-- ============================================================

INSERT INTO transactions
(transaction_id, account_id, transaction_type, amount,
 transaction_date, remaining_balance)
VALUES
('TXN00001', 1, 'Deposit', 10000.00, '2026-11-01 10:00:00', 50000.00),
('TXN00002', 1, 'Withdrawal', 5000.00, '2026-11-05 14:30:00', 45000.00),
('TXN00003', 2, 'Deposit', 25000.00, '2026-11-02 11:00:00', 75000.00),
('TXN00004', 2, 'Withdrawal', 10000.00, '2026-11-08 16:45:00', 65000.00),
('TXN00005', 3, 'Deposit', 15000.00, '2026-11-03 08:30:00', 25000.00),
('TXN00006', 4, 'Deposit', 5000.00, '2026-11-10 09:15:00', 40000.00),
('TXN00007', 5, 'Withdrawal', 2000.00, '2026-11-12 13:20:00', 58000.00),
('TXN00008', 6, 'Deposit', 8000.00, '2026-11-15 12:00:00', 35000.00),
('TXN00009', 7, 'Withdrawal', 3000.00, '2026-11-16 14:00:00', 52000.00),
('TXN00010', 8, 'Deposit', 4000.00, '2026-11-17 11:30:00', 30000.00);

-- ============================================================
-- Verify Database
-- ============================================================

SHOW TABLES;

SELECT * FROM customers;

SELECT * FROM accounts;

SELECT * FROM transactions;
