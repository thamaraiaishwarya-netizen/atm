
import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="atm_database"
    )


if __name__ == "__main__":

    try:
        conn = get_db_connection()

        if conn.is_connected():
            print("MySQL Connected Successfully!")

            cursor = conn.cursor()
            cursor.execute("SELECT DATABASE()")

            result = cursor.fetchone()
            print("Database Name:", result[0])

            cursor.close()
            conn.close()

    except Exception as e:
        print("MySQL Connection Failed!")
        print("Error:", e)
