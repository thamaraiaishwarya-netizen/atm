from database import get_db_connection
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from functools import wraps
from auth import authenticate_user, mask_card, mask_account
from atm_operations import (
    get_balance,
    deposit as perform_deposit,
    withdraw as perform_withdraw,
    get_mini_statement
)
from atm_operations import deposit as perform_deposit

app = Flask(__name__)
app.secret_key = 'secure_atm_secret_key_2024_change_in_production'


# ─────────────────────────────────────────────
#  Decorator
# ─────────────────────────────────────────────

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'account_id' not in session:
            flash('Please authenticate to continue.', 'error')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated


# ─────────────────────────────────────────────
#  Routes
# ─────────────────────────────────────────────

@app.route('/')
def index():
    return redirect(url_for('login'))
     

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')

    # POST – authenticate the user
    card_number = request.form.get('card_number', '').replace(' ', '')
    pin         = request.form.get('pin', '').strip()

    if not card_number or not pin:
        flash('Please enter card number and PIN.', 'error')
        return redirect(url_for('login'))

    account = authenticate_user(card_number, pin)
    if account:
        session.clear()
        session['account_id']     = account['account_id']
        session['customer_name']  = account['customer_name']
        session['card_number']    = account['card_number']
        session['masked_card']    = mask_card(account['card_number'])
        session['account_type']   = account['account_type']
        session['account_number'] = account['account_number']
        return redirect(url_for('dashboard'))
    else:
        flash('Invalid card number or PIN. Please try again.', 'error')
        return redirect(url_for('login'))


@app.route('/dashboard')
@login_required
def dashboard():
    account_id = session['account_id']
    balance = get_balance(account_id)

    print("ACCOUNT ID:", account_id)
    print("BALANCE INFO:", balance)

    return render_template('dashboard.html', balance=balance['balance'])

@app.route('/deposit', methods=['GET', 'POST'])
@login_required
def deposit_route():
    if request.method == 'GET':
        info = get_balance(session['account_id'])
        return render_template(
            'deposit.html',
            customer_name=session['customer_name'],
            masked_card=session['masked_card'],
            current_balance=info['balance'],
        )

    # POST – process deposit
    try:
        amount = float(request.form.get('amount', '0').replace(',', ''))
    except (ValueError, TypeError):
        flash('Invalid amount.', 'error')
        return redirect(url_for('deposit_route'))

    if amount <= 0:
        flash('Amount must be greater than zero.', 'error')
        return redirect(url_for('deposit_route'))

    success, new_balance, txn_id, txn_date, error = perform_deposit(session['account_id'], amount)
    if success:
        session['receipt'] = dict(
            transaction_id=txn_id,
            transaction_type='Deposit',
            amount=f'{amount:.2f}',
            remaining_balance=f'{new_balance:.2f}',
            transaction_date=txn_date,
            customer_name=session['customer_name'],
            masked_card=session['masked_card'],
        )
        flash(f'Deposit of Rs.{amount:.2f} successful!', 'success')
        return redirect(url_for('receipt_route'))
    else:
        flash(f'Deposit failed: {error}', 'error')
        return redirect(url_for('deposit_route'))


@app.route('/withdraw', methods=['GET', 'POST'])
@login_required
def withdraw_route():
    if request.method == 'GET':
        info = get_balance(session['account_id'])
        return render_template(
            'withdraw.html',
            customer_name=session['customer_name'],
            masked_card=session['masked_card'],
            current_balance=info['balance'],
        )

    # POST – process withdrawal
    try:
        amount = float(request.form.get('amount', '0').replace(',', ''))
    except (ValueError, TypeError):
        flash('Invalid amount.', 'error')
        return redirect(url_for('withdraw_route'))

    if amount <= 0:
        flash('Amount must be greater than zero.', 'error')
        return redirect(url_for('withdraw_route'))

    success, new_balance, txn_id, txn_date, error = perform_withdraw(session['account_id'], amount)
    if success:
        session['receipt'] = dict(
            transaction_id=txn_id,
            transaction_type='Withdrawal',
            amount=f'{amount:.2f}',
            remaining_balance=f'{new_balance:.2f}',
            transaction_date=txn_date,
            customer_name=session['customer_name'],
            masked_card=session['masked_card'],
        )
        flash(f'Withdrawal of Rs.{amount:.2f} successful!', 'success')
        return redirect(url_for('receipt_route'))
    else:
        flash(f'Transaction failed: {error}', 'error')
        return redirect(url_for('withdraw_route'))


@app.route('/balance')
@login_required
def balance_route():
    info           = get_balance(session['account_id'])
    masked_account = mask_account(info['account_number'])
    return render_template(
        'balance.html',
        customer_name=session['customer_name'],
        masked_card=session['masked_card'],
        balance=info['balance'],
        account_type=info['account_type'],
        masked_account=masked_account,
    )


@app.route('/statement')
@login_required
def statement_route():
    transactions = get_mini_statement(session['account_id'])
    return render_template(
        'statement.html',
        customer_name=session['customer_name'],
        masked_card=session['masked_card'],
        transactions=transactions,
    )

@app.route('/receipt')
@login_required
def receipt_route():
    if 'receipt' not in session:
        return redirect(url_for('dashboard'))

    receipt_data = session.pop('receipt')
    return render_template('receipt.html', **receipt_data)


@app.route('/logout')
def logout():
    session.clear()
    flash('Thank you for using Secure Bank ATM. Goodbye!', 'success')
    return redirect(url_for('login'))


# ─────────────────────────────────────────────
#  Entry point
# ─────────────────────────────────────────────

if __name__ == '__main__':
    app.run(debug=True, port=5000)
