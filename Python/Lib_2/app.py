from flask import Flask, jsonify, request
import psycopg2

app = Flask(__name__)

# Database connection details
DB_NAME = "library_management"
DB_USER = "postgres"
DB_PASSWORD = "sitaram"
DB_HOST = "localhost"
DB_PORT = "5432"

def get_db_connection():
    return psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )

# ✅ 1. List authors whose books are currently borrowed
@app.route('/authors/borrowed', methods=['GET'])
def get_borrowed_authors():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
        SELECT DISTINCT a.author_id, a.name, a.nationality 
        FROM Authors a
        JOIN Books b ON a.author_id = b.author_id
        JOIN BookCopies bc ON b.book_id = bc.book_id
        JOIN BorrowedBooks bb ON bc.copy_id = bb.copy_id
        WHERE bb.return_date IS NULL;
        """
        cursor.execute(query)
        authors = cursor.fetchall()
        cursor.close()
        conn.close()

        result = [{"author_id": row[0], "name": row[1], "nationality": row[2]} for row in authors]
        return jsonify(result)
    except psycopg2.Error as e:
        return jsonify({"error": str(e)}), 500

# ✅ 2. Find books that are borrowed but have no available copies
@app.route('/books/no-available-copies', methods=['GET'])
def get_books_no_available_copies():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
        SELECT DISTINCT b.book_id, b.title, b.genre
        FROM Books b
        JOIN BookCopies bc ON b.book_id = bc.book_id
        JOIN BorrowedBooks bb ON bc.copy_id = bb.copy_id
        WHERE bb.return_date IS NULL
        AND bc.available_copies = 0;
        """
        cursor.execute(query)
        books = cursor.fetchall()
        cursor.close()
        conn.close()

        result = [{"book_id": row[0], "title": row[1], "genre": row[2]} for row in books]
        return jsonify(result)
    except psycopg2.Error as e:
        return jsonify({"error": str(e)}), 500

# ✅ 3. Find authors whose books have been borrowed more than 5 times
@app.route('/authors/popular', methods=['GET'])
def get_popular_authors():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
        SELECT a.author_id, a.name, COUNT(bb.borrow_id) AS total_borrows
        FROM Authors a
        JOIN Books b ON a.author_id = b.author_id
        JOIN BookCopies bc ON b.book_id = bc.book_id
        JOIN BorrowedBooks bb ON bc.copy_id = bb.copy_id
        GROUP BY a.author_id, a.name
        HAVING COUNT(bb.borrow_id) > 5;
        """
        cursor.execute(query)
        authors = cursor.fetchall()
        cursor.close()
        conn.close()

        result = [{"author_id": row[0], "name": row[1], "total_borrows": row[2]} for row in authors]
        return jsonify(result)
    except psycopg2.Error as e:
        return jsonify({"error": str(e)}), 500

# ✅ 4. If a book has been borrowed more than 10 times, increase available_copies by 2
@app.route('/books/increase-copies', methods=['PUT'])
def increase_available_copies():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Find books borrowed more than 10 times
        query = """
        SELECT b.book_id, COUNT(bb.borrow_id) AS borrow_count
        FROM Books b
        JOIN BookCopies bc ON b.book_id = bc.book_id
        JOIN BorrowedBooks bb ON bc.copy_id = bb.copy_id
        GROUP BY b.book_id
        HAVING COUNT(bb.borrow_id) > 10;
        """
        cursor.execute(query)
        popular_books = cursor.fetchall()

        updated_books = []
        for book in popular_books:
            book_id = book[0]
            # Increase available copies by 2
            update_query = """
            UPDATE BookCopies
            SET available_copies = available_copies + 2
            WHERE book_id = %s;
            """
            cursor.execute(update_query, (book_id,))
            updated_books.append(book_id)

        conn.commit()
        cursor.close()
        conn.close()

        if updated_books:
            return jsonify({"message": f"Updated available copies for books: {updated_books}"})
        else:
            return jsonify({"message": "No books found that qualify for update"}), 404
    except psycopg2.Error as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
