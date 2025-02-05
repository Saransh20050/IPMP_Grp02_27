const express = require("express");
const pool = require("./db");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 🔴 CREATE - Add a new user
app.post("/details", async (req, res) => {
    try {
        const { name, email } = req.body;
        const newUser = await pool.query(
            "INSERT INTO details (name, email) VALUES ($1, $2) RETURNING *",
            [name, email]
        );
        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 🟢 READ - Get all details
app.get("/details", async (req, res) => {
    try {
        const alldetails = await pool.query("SELECT * FROM details");
        res.json(alldetails.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 🟡 UPDATE - Update a user by ID
app.put("/details/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        await pool.query(
            "UPDATE details SET name = $1, email = $2 WHERE id = $3",
            [name, email, id]
        );
        res.send("User Updated!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 🔵 DELETE - Remove a user by ID
app.delete("/details/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM details WHERE id = $1", [id]);
        res.send("User Deleted!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

