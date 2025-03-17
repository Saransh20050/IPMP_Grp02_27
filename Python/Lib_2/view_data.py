import psycopg2

# Database connection details
DB_NAME = "library_management"
DB_USER = "postgres"  # Change if your username is different
DB_PASSWORD = "sitaram"
DB_HOST = "localhost"
DB_PORT = "5432"

try:
    # Connect to the database
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    cursor = conn.cursor()

    # Fetch and display data from all tables
    tables = ["Authors", "Books", "LibraryBranches", "BookCopies", "BorrowedBooks"]
    
    for table in tables:
        print(f"\nData from {table}:")
        cursor.execute(f"SELECT * FROM {table};")
        rows = cursor.fetchall()
        for row in rows:
            print(row)

    # Close connection
    cursor.close()
    conn.close()

except psycopg2.Error as e:
    print("Error retrieving data:", e)
