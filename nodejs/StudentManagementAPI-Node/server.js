const express = require("express");
const mysql = require("mysql");
require("dotenv").config();

const app = express();
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.message);
    return;
  }
  console.log("Connected to MySQL database!");
});

// Remove 'date' Column from Enrollment Table
app.put("/remove-date-column", (req, res) => {
  const query = `ALTER TABLE enrollment DROP COLUMN date`;
  db.query(query, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "'date' column removed from enrollment table successfully!" });
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
