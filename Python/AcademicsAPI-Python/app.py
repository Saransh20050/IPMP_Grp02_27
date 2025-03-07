from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

# Database Configuration
db = mysql.connector.connect(
    host="localhost",
    user="root",  # Change if using a different user
    password="",  # Add password if set
    database="academics"
)
cursor = db.cursor()

# Create the Students table if not exists
cursor.execute("""
    CREATE TABLE IF NOT EXISTS Students (
        student_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        age INT,
        gender ENUM('Male', 'Female'),
        email VARCHAR(100) UNIQUE
    )
""")
db.commit()

# 1️⃣ CREATE Student
@app.route('/students/create', methods=['POST'])
def create_student():
    data = request.json
    name, age, gender, email = data["name"], data["age"], data["gender"], data["email"]
    
    try:
        cursor.execute("INSERT INTO Students (name, age, gender, email) VALUES (%s, %s, %s, %s)", (name, age, gender, email))
        db.commit()
        return jsonify({"message": "Student created successfully!"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# Run the Flask App
if __name__ == '__main__':
    app.run(debug=True, port=5000)
