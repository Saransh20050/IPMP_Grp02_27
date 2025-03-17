import psycopg2

# Database connection details
DB_NAME = "library_management"
DB_USER = "postgres"
DB_PASSWORD = "sitaram"
DB_HOST = "localhost"
DB_PORT = "5432"

# Connect to PostgreSQL (default "postgres" database to create a new one)
try:
    conn = psycopg2.connect(
        dbname="postgres",
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    conn.autocommit = True
    cursor = conn.cursor()

    # Create database
    cursor.execute(f"CREATE DATABASE {DB_NAME};")
    print(f"Database '{DB_NAME}' created successfully!")

    # Close initial connection
    cursor.close()
    conn.close()

except psycopg2.Error as e:
    print("Error creating database:", e)

# Now connect to the newly created database
try:
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    cursor = conn.cursor()

    # Create tables
    create_tables = '''
    CREATE TABLE IF NOT EXISTS Authors (
        author_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        nationality VARCHAR(100) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Books (
        book_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        genre VARCHAR(100) NOT NULL,
        author_id INT REFERENCES Authors(author_id)
    );

    CREATE TABLE IF NOT EXISTS LibraryBranches (
        branch_id SERIAL PRIMARY KEY,
        branch_name VARCHAR(255) NOT NULL,
        location VARCHAR(100) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS BookCopies (
        copy_id SERIAL PRIMARY KEY,
        book_id INT REFERENCES Books(book_id),
        branch_id INT REFERENCES LibraryBranches(branch_id),
        total_copies INT NOT NULL,
        available_copies INT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS BorrowedBooks (
        borrow_id SERIAL PRIMARY KEY,
        copy_id INT REFERENCES BookCopies(copy_id),
        member_id INT NOT NULL,
        borrow_date DATE NOT NULL,
        return_date DATE
    );
    '''
    cursor.execute(create_tables)
    conn.commit()
    print("Tables created successfully!")

    # Insert initial data
    insert_data = '''
    INSERT INTO Authors (name, nationality) VALUES
    ('George Orwell', 'British'),
    ('J.K. Rowling', 'British'),
    ('Agatha Christie', 'British')
    ON CONFLICT (author_id) DO NOTHING;

    INSERT INTO Books (title, genre, author_id) VALUES
    ('1984', 'Dystopian', 1),
    ('Harry Potter', 'Fantasy', 2),
    ('Murder on the Orient Express', 'Mystery', 3),
    ('Animal Farm', 'Dystopian', 1)
    ON CONFLICT (book_id) DO NOTHING;

    INSERT INTO LibraryBranches (branch_name, location) VALUES
    ('Central Library', 'New York'),
    ('Downtown Library', 'Los Angeles'),
    ('Uptown Library', 'Chicago')
    ON CONFLICT (branch_id) DO NOTHING;

    INSERT INTO BookCopies (book_id, branch_id, total_copies, available_copies) VALUES
    (1, 1, 10, 8),
    (2, 2, 5, 2),
    (3, 3, 7, 4),
    (4, 1, 6, 3),
    (1, 2, 4, 2)
    ON CONFLICT (copy_id) DO NOTHING;

    INSERT INTO BorrowedBooks (copy_id, member_id, borrow_date, return_date) VALUES
    (1, 101, '2024-02-15', NULL),
    (2, 102, '2024-02-20', '2024-02-25'),
    (3, 103, '2024-03-01', NULL),
    (4, 104, '2024-03-05', '2024-03-10'),
    (5, 105, '2024-03-08', NULL)
    ON CONFLICT (borrow_id) DO NOTHING;
    '''
    cursor.execute(insert_data)
    conn.commit()
    print("Initial data inserted successfully!")

    # Close connection
    cursor.close()
    conn.close()

except psycopg2.Error as e:
    print("Error setting up database:", e)
