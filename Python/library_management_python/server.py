from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Flask App
app = Flask(__name__)

# Load Firebase Credentials
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# 📌 Add a book (POST /add-book)
@app.route("/add-book", methods=["POST"])
def add_book():
    try:
        data = request.json
        book_id = data.get("book_id")
        title = data.get("title")
        author_id = data.get("author_id")
        category_id = data.get("category_id")

        if not book_id or not title or not author_id or not category_id:
            return jsonify({"error": "Missing required fields"}), 400

        db.collection("books").document(book_id).set({
            "title": title,
            "author_id": author_id,
            "category_id": category_id
        })

        return jsonify({"message": "Book added successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 📌 Add an author (POST /add-author)
@app.route("/add-author", methods=["POST"])
def add_author():
    try:
        data = request.json
        author_id = data.get("author_id")
        name = data.get("name")

        if not author_id or not name:
            return jsonify({"error": "Missing required fields"}), 400

        db.collection("authors").document(author_id).set({"name": name})

        return jsonify({"message": "Author added successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 📌 Add a category (POST /add-category)
@app.route("/add-category", methods=["POST"])
def add_category():
    try:
        data = request.json
        category_id = data.get("category_id")
        name = data.get("name")

        if not category_id or not name:
            return jsonify({"error": "Missing required fields"}), 400

        db.collection("categories").document(category_id).set({"name": name})

        return jsonify({"message": "Category added successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 📌 Delete an author and all their books (DELETE /delete-author)
@app.route("/delete-author", methods=["DELETE"])
def delete_author():
    try:
        data = request.json
        author_name = data.get("author_name")

        if not author_name:
            return jsonify({"error": "Author name is required"}), 400

        # Find the author ID
        authors_ref = db.collection("authors").where("name", "==", author_name).stream()
        author_docs = [doc for doc in authors_ref]

        if not author_docs:
            return jsonify({"error": "Author not found"}), 404

        author_id = author_docs[0].id

        # Find and delete all books written by this author
        books_ref = db.collection("books").where("author_id", "==", author_id).stream()
        for book in books_ref:
            db.collection("books").document(book.id).delete()

        # Delete the author
        db.collection("authors").document(author_id).delete()

        return jsonify({"message": f"Author '{author_name}' and all their books have been deleted!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Start the server
if __name__ == "__main__":
    app.run(debug=True, port=5000)
