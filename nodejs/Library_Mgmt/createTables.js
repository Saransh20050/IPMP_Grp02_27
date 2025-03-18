const client = require("./database");

const createTables = async () => {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS authors (
        author_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        nationality VARCHAR(100) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS books (
        book_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        genre VARCHAR(100) NOT NULL,
        author_id INT REFERENCES authors(author_id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS library_branches (
        branch_id SERIAL PRIMARY KEY,
        branch_name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS book_copies (
        copy_id SERIAL PRIMARY KEY,
        book_id INT REFERENCES books(book_id) ON DELETE CASCADE,
        branch_id INT REFERENCES library_branches(branch_id) ON DELETE CASCADE,
        total_copies INT NOT NULL,
        available_copies INT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS borrowed_books (
        borrow_id SERIAL PRIMARY KEY,
        copy_id INT REFERENCES book_copies(copy_id) ON DELETE CASCADE,
        member_id INT NOT NULL,
        borrow_date DATE NOT NULL,
        return_date DATE
      );
    `);

    console.log("Tables created successfully!");
  } catch (err) {
    console.error("Error creating tables", err);
  } finally {
    client.end();
  }
};

createTables();
