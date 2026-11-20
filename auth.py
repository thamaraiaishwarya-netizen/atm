
import re
from werkzeug.security import check_password_hash
from database import get_db_connection


def authenticate_user(card_number: str, pin: str):

    conn = None

    try:
        clean_card = card_number.replace(' ', '').strip()
        clean_pin = pin.strip()

        # Validate card number
        if not re.fullmatch(r'[0-9]{16}', clean_card):
            return None

        # Validate PIN
        if not re.fullmatch(r'[0-9]{4}', clean_pin):
            return None

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        sql = '''
            SELECT
                a.account_id,
                a.customer_id,
                a.account_number,
                a.atm_card_number,
                a.hashed_pin,
                a.account_type,
                a.balance,
                c.customer_name,
                c.phone_number
            FROM accounts a
            JOIN customers c
                ON a.customer_id = c.customer_id
            WHERE a.atm_card_number = %s
        '''

        cursor.execute(sql, (clean_card,))
        row = cursor.fetchone()
        cursor.close()

        if row is None:
            print("Login failed: Card number not found")
            return None

        # Verify hashed PIN
        if not check_password_hash(row['hashed_pin'], clean_pin):
            print("Login failed: Incorrect PIN")
            return None

        print("Login successful!")

        return {
            'account_id': row['account_id'],
            'customer_name': row['customer_name'],
            'card_number': row['atm_card_number'],
            'account_type': row['account_type'],
            'balance': float(row['balance']),
            'account_number': row['account_number'],
            'phone_number': row['phone_number']
        }

    except Exception as e:
        print("Auth error:", e)
        return None

    finally:
        if conn and conn.is_connected():
            conn.close()


def mask_card(card_number: str) -> str:

    clean = card_number.replace(' ', '')

    if len(clean) != 16:
        return card_number

    return f'**** **** **** {clean[-4:]}'


def mask_account(account_number: str) -> str:

    if len(account_number) <= 4:
        return account_number

    return '*' * (len(account_number) - 4) + account_number[-4:]
