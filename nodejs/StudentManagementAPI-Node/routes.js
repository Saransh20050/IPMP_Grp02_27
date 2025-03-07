const express = require('express');
const router = express.Router();
const db = require('./db');

// Initialize Database Tables (POST /init)
router.post('/init', (req, res) => {
    const queries = [
        `CREATE TABLE IF NOT EXISTS students (
            student_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            age INT,
            gender VARCHAR(10),
            email VARCHAR(100),
            phone_number VARCHAR(15)
        )`,
        `CREATE TABLE IF NOT EXISTS professors (
            professor_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            department VARCHAR(100)
        )`,
        `CREATE TABLE IF NOT EXISTS courses (
            course_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            professor_id INT,
            FOREIGN KEY (professor_id) REFERENCES professors(professor_id) ON DELETE CASCADE
        )`,
        `CREATE TABLE IF NOT EXISTS enrollment (
            enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT,
            course_id INT,
            FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
            FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
        )`
    ];

    queries.forEach(query => db.query(query, err => {
        if (err) console.error(err);
    }));

    res.json({ message: "Database initialized successfully!" });
});

module.exports = router;
