const express = require("express");
const client = require("./database"); // PostgreSQL connection from database.js

const app = express();
app.use(express.json());

// List authors whose books are currently borrowed
app.get("/authors/currently-borrowed", async (req, res) => {
  try {
    const result = await client.query(`
      SELECT DISTINCT a.author_id, a.name, a.nationality
      FROM authors a
      JOIN books b ON a.author_id = b.author_id
      JOIN book_copies bc ON b.book_id = bc.book_id
      JOIN borrowed_books bb ON bc.copy_id = bb.copy_id
      WHERE bb.return_date IS NULL
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching authors:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Find books that are borrowed but have no available copies in the library
app.get("/books/no-available-copies", async (req, res) => {
  try {
    const result = await client.query(`
      SELECT DISTINCT b.book_id, b.title, b.genre, a.name AS author
      FROM books b
      JOIN authors a ON b.author_id = a.author_id
      JOIN book_copies bc ON b.book_id = bc.book_id
      JOIN borrowed_books bb ON bc.copy_id = bb.copy_id
      WHERE bb.return_date IS NULL AND bc.available_copies = 0
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching books with no available copies:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Show available books at each branch
app.get("/books/available-at-branches", async (req, res) => {
  try {
    const result = await client.query(`
      SELECT lb.branch_id, lb.branch_name, b.book_id, b.title, b.genre, a.name AS author, bc.available_copies
      FROM library_branches lb
      JOIN book_copies bc ON lb.branch_id = bc.branch_id
      JOIN books b ON bc.book_id = b.book_id
      JOIN authors a ON b.author_id = a.author_id
      WHERE bc.available_copies > 0
      ORDER BY lb.branch_id, b.title
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching available books:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Find the most popular book (most borrowed book)
app.get("/books/most-popular", async (req, res) => {
  try {
    const result = await client.query(`
      SELECT b.book_id, b.title, b.genre, a.name AS author, COUNT(bb.borrow_id) AS times_borrowed
      FROM books b
      JOIN authors a ON b.author_id = a.author_id
      JOIN book_copies bc ON b.book_id = bc.book_id
      JOIN borrowed_books bb ON bc.copy_id = bb.copy_id
      GROUP BY b.book_id, b.title, b.genre, a.name
      ORDER BY times_borrowed DESC
      LIMIT 1
    `);
    
    res.json(result.rows[0] || { message: "No books borrowed yet" });
  } catch (err) {
    console.error("Error fetching most popular book:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Find authors whose books have been borrowed more than 5 times
app.get("/authors/borrowed-more-than-5", async (req, res) => {
  try {
    const result = await client.query(`
      SELECT a.author_id, a.name, COUNT(bb.borrow_id) AS total_borrows
      FROM authors a
      JOIN books b ON a.author_id = b.author_id
      JOIN book_copies bc ON b.book_id = bc.book_id
      JOIN borrowed_books bb ON bc.copy_id = bb.copy_id
      GROUP BY a.author_id, a.name
      HAVING COUNT(bb.borrow_id) > 5
      ORDER BY total_borrows DESC
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching authors with more than 5 borrows:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Increase available_copies by 2 if a book has been borrowed more than 10 times
app.put("/books/increase-available-copies", async (req, res) => {
  try {
    const result = await client.query(`
      UPDATE book_copies
      SET available_copies = available_copies + 2
      WHERE book_id IN (
        SELECT b.book_id
        FROM books b
        JOIN book_copies bc ON b.book_id = bc.book_id
        JOIN borrowed_books bb ON bc.copy_id = bb.copy_id
        GROUP BY b.book_id
        HAVING COUNT(bb.borrow_id) > 10
      )
      RETURNING *;
    `);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No books met the criteria." });
    }

    res.json({
      message: "Available copies increased for books borrowed more than 10 times.",
      updatedBooks: result.rows,
    });
  } catch (err) {
    console.error("Error updating available copies:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete borrowed books older than 30 days if not returned
app.delete("/books/delete-old-unreturned-borrows", async (req, res) => {
  try {
    const result = await client.query(`
      DELETE FROM borrowed_books 
      WHERE borrow_date < NOW() - INTERVAL '30 days' AND return_date IS NULL
      RETURNING *;
    `);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No old unreturned borrow records found" });
    }

    res.json({ message: "Deleted old unreturned borrow records", deletedRecords: result.rows });
  } catch (err) {
    console.error("Error deleting old unreturned borrow records:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
