import uuid
import datetime
from database import get_db_connection


def get_balance(account_id: int) -> dict:
    '''Returns account info including balance.'''
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    sql = '''
        SELECT a.account_id, a.account_number, a.atm_card_number,
               a.account_type, a.balance,
               c.customer_name
        FROM accounts a
        JOIN customers c ON a.customer_id = c.customer_id
        WHERE a.account_id = %s
    '''
    cursor.execute(sql, (account_id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    if row:
        row['balance'] = float(row['balance'])
    return row


def deposit(account_id: int, amount: float):
    '''
    Deposits amount into account.
    Returns (success, new_balance, txn_id, txn_date, error)
    '''
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Lock the row
        cursor.execute('SELECT balance FROM accounts WHERE account_id = %s FOR UPDATE', (account_id,))
        row = cursor.fetchone()
        if row is None:
            return (False, 0, '', '', 'Account not found.')

        new_balance = float(row['balance']) + amount
        txn_id = str(uuid.uuid4())[:8].upper()
        txn_date = datetime.datetime.now().strftime('%d %b %Y %H:%M:%S')
        txn_datetime = datetime.datetime.now()

        cursor.execute('UPDATE accounts SET balance = %s WHERE account_id = %s',
                       (new_balance, account_id))
        cursor.execute(
            '''INSERT INTO transactions
               (transaction_id, account_id, transaction_type, amount, transaction_date, remaining_balance)
               VALUES (%s, %s, %s, %s, %s, %s)''',
            (txn_id, account_id, 'Deposit', amount, txn_datetime, new_balance)
        )
        conn.commit()
        cursor.close()
        return (True, new_balance, txn_id, txn_date, '')

    except Exception as e:
        if conn:
            conn.rollback()
        return (False, 0, '', '', str(e))
    finally:
        if conn and conn.is_connected():
            conn.close()


def withdraw(account_id: int, amount: float):
    '''
    Withdraws amount from account.
    Returns (success, new_balance, txn_id, txn_date, error)
    '''
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute('SELECT balance FROM accounts WHERE account_id = %s FOR UPDATE', (account_id,))
        row = cursor.fetchone()
        if row is None:
            return (False, 0, '', '', 'Account not found.')

        current_balance = float(row['balance'])
        if current_balance < amount:
            cursor.close()
            conn.rollback()
            return (False, 0, '', '', 'Insufficient balance. Please check your available balance.')

        new_balance = current_balance - amount
        txn_id = str(uuid.uuid4())[:8].upper()
        txn_date = datetime.datetime.now().strftime('%d %b %Y %H:%M:%S')
        txn_datetime = datetime.datetime.now()

        cursor.execute('UPDATE accounts SET balance = %s WHERE account_id = %s',
                       (new_balance, account_id))
        cursor.execute(
            '''INSERT INTO transactions
               (transaction_id, account_id, transaction_type, amount, transaction_date, remaining_balance)
               VALUES (%s, %s, %s, %s, %s, %s)''',
            (txn_id, account_id, 'Withdrawal', amount, txn_datetime, new_balance)
        )
        conn.commit()
        cursor.close()
        return (True, new_balance, txn_id, txn_date, '')

    except Exception as e:
        if conn:
            conn.rollback()
        return (False, 0, '', '', str(e))
    finally:
        if conn and conn.is_connected():
            conn.close()


def get_mini_statement(account_id: int) -> list:
    '''Returns last 10 transactions for the account, newest first.'''
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        '''SELECT transaction_id, transaction_type, amount,
                  transaction_date, remaining_balance
           FROM transactions
           WHERE account_id = %s
           ORDER BY transaction_date DESC
           LIMIT 10''',
        (account_id,)
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    result = []
    for r in rows:
        result.append({
            'transaction_id':    r['transaction_id'],
            'transaction_type':  r['transaction_type'],
            'amount':            f"{float(r['amount']):.2f}",
            'transaction_date':  r['transaction_date'].strftime('%d %b %Y %H:%M') if hasattr(r['transaction_date'], 'strftime') else str(r['transaction_date']),
            'remaining_balance': f"{float(r['remaining_balance']):.2f}",
        })
    return result
