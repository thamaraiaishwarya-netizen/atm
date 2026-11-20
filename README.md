# Smart ATM Banking Management System

## Overview

A fully functional ATM Banking System built with Python Flask, MySQL, and Bootstrap 5,
featuring a realistic ATM machine interface with premium dark navy theme.

---

## Technology Stack

| Layer    | Technology                            |
|----------|---------------------------------------|
| Frontend | HTML5, CSS3, Bootstrap 5, JavaScript  |
| Backend  | Python 3.x, Flask                     |
| Database | MySQL                                 |
| Security | Werkzeug PBKDF2 password hashing      |

---

## Project Structure

```
smart_atm/
├── app.py                  # Main Flask application & all route handlers
├── database.py             # MySQL connection and query helpers
├── generate_hashes.py      # Utility to generate PBKDF2 PIN hashes
├── requirements.txt        # Python dependency list
├── atm_database.sql        # Full MySQL schema + seed data
├── static/
│   ├── css/
│   │   └── style.css       # Custom ATM dark-navy theme & animations
│   └── js/
│       └── atm.js          # Virtual keypad logic & client-side helpers
└── templates/
    ├── base.html           # Shared layout (Bootstrap 5, navbar, footer)
    ├── login.html          # Card number + PIN entry with virtual keypad
    ├── dashboard.html      # Operation selection menu
    ├── deposit.html        # Deposit amount form + confirmation
    ├── withdraw.html       # Withdrawal amount form + balance check
    ├── balance.html        # Balance enquiry display
    ├── mini_statement.html # Last 10 transactions table
    └── receipt.html        # Transaction receipt after deposit/withdraw
```

---

## Prerequisites

- Python 3.8 or higher
- MySQL Server (XAMPP recommended for beginners)
- pip (Python package manager)

---

## Step-by-Step Installation

### Step 1: Navigate to Project Directory

```bash
cd "smart_atm"
```

---

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

---

### Step 3: Set Up MySQL Database

#### 3a. Start MySQL Server

- **XAMPP users:** Open XAMPP Control Panel → Click **Start** next to MySQL.
- **Native MySQL users:** Ensure the MySQL service is running.

#### 3b. Generate Password Hashes

```bash
python generate_hashes.py
```

> Copy the `UPDATE` SQL statements printed to the console — you will need them in the next step.

#### 3c. Import the Database

1. Open **MySQL Workbench** or **phpMyAdmin**.
2. Run `atm_database.sql` to create the schema and insert seed data.
3. Then execute the `UPDATE` statements copied from `generate_hashes.py` to store hashed PINs.

#### 3d. Update Database Credentials (if needed)

Open `database.py` and edit the connection settings:

```python
DB_CONFIG = {
    "host": "localhost",
    "user": "root",        # change if your MySQL user is different
    "password": "",        # add your MySQL password here
    "database": "smart_atm"
}
```

> Default configuration assumes **XAMPP** with user `root` and no password.

---

### Step 4: Run the Application

```bash
python app.py
```

You should see output similar to:

```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

---

### Step 5: Open in Browser

```
http://localhost:5000
```

---

## Test Accounts

| Customer Name | Card Number      | PIN  | Account Type | Balance     |
|---------------|------------------|------|--------------|-------------|
| Rahul Sharma  | 1234567890123456 | 1234 | Savings      | Rs.50,000   |
| Priya Patel   | 9876543210987654 | 5678 | Current      | Rs.75,000   |
| Amit Verma    | 1111222233334444 | 9999 | Savings      | Rs.25,000   |

---

## ATM Operations Guide

1. **Login** — Enter your 16-digit card number and 4-digit PIN using the virtual keypad.
2. **Dashboard** — Choose from 5 available operations after successful authentication.
3. **Deposit** — Enter the amount to deposit, confirm on the review screen, and receive a printed receipt.
4. **Withdraw** — Enter the desired amount; the system checks your available balance before processing.
5. **Balance Enquiry** — View your current account balance along with card and account details.
6. **Mini Statement** — View a table of your last 10 transactions (date, type, amount, running balance).
7. **Exit** — Clears your session securely and returns you to the login screen.

---

## Troubleshooting

| Issue                     | Solution                                                                 |
|---------------------------|--------------------------------------------------------------------------|
| Database connection error | Verify MySQL is running; check host, user, and password in `database.py` |
| `ModuleNotFoundError`     | Run `pip install -r requirements.txt` from inside the `smart_atm/` folder |
| PIN not working           | Run `generate_hashes.py` and apply the printed `UPDATE` statements        |
| Port 5000 in use          | Change the port in `app.py`: `app.run(port=5001)`                        |

---

## Security Features

- **Werkzeug PBKDF2:SHA256 PIN hashing** — PINs are never stored in plain text.
- **Flask session-based authentication** — Every protected route checks for a valid session.
- **Parameterized SQL queries** — All database calls use placeholders to prevent SQL injection.
- **Server-side input validation** — Amounts and inputs are validated on the backend, not just the browser.
- **Session cleared on logout** — Calling the Exit operation fully invalidates the server-side session.
- **Database transactions** — Deposits and withdrawals use atomic transactions to prevent race conditions and partial updates.
