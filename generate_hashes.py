
"""
generate_hashes.py
==================
Smart ATM Banking Management System - PIN Hash Generator

Usage:
    python generate_hashes.py

What it does:
    1. Generates Werkzeug PIN hashes for all 10 accounts.
    2. Prints UPDATE SQL statements.
    3. Prints a complete INSERT INTO accounts statement.
"""

from werkzeug.security import generate_password_hash


# -------------------------------------------------
# PIN -> Account Mapping
# Exact values from atm_database.sql
# -------------------------------------------------

PIN_MAP = [
    {
        "account_id": 1,
        "account_number": "ACC0001001",
        "atm_card_number": "1234567890123456",
        "pin": "1234",
        "account_type": "Savings",
        "balance": "50000.00",
        "customer_id": 1
    },
    {
        "account_id": 2,
        "account_number": "ACC0002001",
        "atm_card_number": "1234567890123457",
        "pin": "2345",
        "account_type": "Current",
        "balance": "75000.00",
        "customer_id": 2
    },
    {
        "account_id": 3,
        "account_number": "ACC0003001",
        "atm_card_number": "1234567890123458",
        "pin": "3456",
        "account_type": "Savings",
        "balance": "25000.00",
        "customer_id": 3
    },
    {
        "account_id": 4,
        "account_number": "ACC0004001",
        "atm_card_number": "1234567890123459",
        "pin": "4567",
        "account_type": "Savings",
        "balance": "40000.00",
        "customer_id": 4
    },
    {
        "account_id": 5,
        "account_number": "ACC0005001",
        "atm_card_number": "1234567890123460",
        "pin": "5678",
        "account_type": "Current",
        "balance": "60000.00",
        "customer_id": 5
    },
    {
        "account_id": 6,
        "account_number": "ACC0006001",
        "atm_card_number": "1234567890123461",
        "pin": "6789",
        "account_type": "Savings",
        "balance": "35000.00",
        "customer_id": 6
    },
    {
        "account_id": 7,
        "account_number": "ACC0007001",
        "atm_card_number": "1234567890123462",
        "pin": "7890",
        "account_type": "Savings",
        "balance": "55000.00",
        "customer_id": 7
    },
    {
        "account_id": 8,
        "account_number": "ACC0008001",
        "atm_card_number": "1234567890123463",
        "pin": "8901",
        "account_type": "Current",
        "balance": "30000.00",
        "customer_id": 8
    },
    {
        "account_id": 9,
        "account_number": "ACC0009001",
        "atm_card_number": "1234567890123464",
        "pin": "9012",
        "account_type": "Savings",
        "balance": "70000.00",
        "customer_id": 9
    },
    {
        "account_id": 10,
        "account_number": "ACC0010001",
        "atm_card_number": "1234567890123465",
        "pin": "1122",
        "account_type": "Savings",
        "balance": "20000.00",
        "customer_id": 10
    }
]


def generate_hashes(pin_map: list[dict]) -> list[dict]:
    """Generate a hash for every account PIN."""
    result = []

    for row in pin_map:
        entry = dict(row)
        entry["hashed_pin"] = generate_password_hash(row["pin"])
        result.append(entry)

    return result


def print_update_statements(hashed_rows: list[dict]) -> None:
    """Print UPDATE statements for existing accounts."""

    print("=" * 70)
    print("-- UPDATE statements")
    print("=" * 70)

    print("USE atm_database;")
    print()

    for row in hashed_rows:
        sql = (
            f"UPDATE accounts\n"
            f"SET hashed_pin = '{row['hashed_pin']}'\n"
            f"WHERE account_id = {row['account_id']};"
        )

        print(sql)
        print()


def print_insert_statement(hashed_rows: list[dict]) -> None:
    """Print complete INSERT statement with hashed PINs."""

    print("=" * 70)
    print("-- FULL INSERT statement")
    print("=" * 70)

    print("USE atm_database;")
    print()

    print("INSERT INTO accounts")
    print("(customer_id, account_number, atm_card_number, "
          "hashed_pin, account_type, balance)")
    print("VALUES")

    lines = []

    for row in hashed_rows:
        line = (
            f"({row['customer_id']}, "
            f"'{row['account_number']}', "
            f"'{row['atm_card_number']}', "
            f"'{row['hashed_pin']}', "
            f"'{row['account_type']}', "
            f"{row['balance']})"
        )

        lines.append(line)

    print(",\n".join(lines) + ";")
    print()


def print_summary(hashed_rows: list[dict]) -> None:
    """Print account and PIN summary."""

    print("=" * 70)
    print("-- PIN SUMMARY")
    print("=" * 70)

    for row in hashed_rows:
        print(
            f"Account ID: {row['account_id']} | "
            f"Card: {row['atm_card_number']} | "
            f"PIN: {row['pin']}"
        )

    print()


# -------------------------------------------------
# Main
# -------------------------------------------------

if __name__ == "__main__":

    print("\nGenerating PIN hashes for 10 accounts...\n")

    hashed_rows = generate_hashes(PIN_MAP)

    print_summary(hashed_rows)
    print_update_statements(hashed_rows)
    print_insert_statement(hashed_rows)

    print("Done! 10 account PIN hashes generated successfully.")
