const client = require("./database");

const insertData = async () => {
  try {
    await client.query(`
      INSERT INTO authors (name, nationality) VALUES
      ('George Orwell', 'British'),
      ('J.K. Rowling', 'British'),
      ('Agatha Christie', 'British');

      INSERT INTO books (title, genre, author_id) VALUES
      ('1984', 'Dystopian', 1),
      ('Harry Potter', 'Fantasy', 2),
      ('Murder on the Orient Express', 'Mystery', 3),
      ('Animal Farm', 'Dystopian', 1);

      INSERT INTO library_branches (branch_name, location) VALUES
      ('Central Library', 'New York'),
      ('Downtown Library', 'Los Angeles'),
      ('Uptown Library', 'Chicago');

      INSERT INTO book_copies (book_id, branch_id, total_copies, available_copies) VALUES
      (1, 1, 10, 8), -- 1984 at Central Library
      (2, 2, 5, 2),  -- Harry Potter at Downtown Library
      (3, 3, 7, 4),  -- Murder on the Orient Express at Uptown Library
      (4, 1, 6, 3),  -- Animal Farm at Central Library
      (1, 2, 4, 2);  -- 1984 at Downtown Library

      INSERT INTO borrowed_books (copy_id, member_id, borrow_date, return_date) VALUES
      (1, 101, '2024-02-15', NULL), -- 1984 at Central Library, Not Returned
      (2, 102, '2024-02-20', '2024-02-25'), -- Harry Potter, Returned
      (3, 103, '2024-03-01', NULL), -- Murder on the Orient Express, Not Returned
      (4, 104, '2024-03-05', '2024-03-10'), -- Animal Farm, Returned
      (5, 105, '2024-03-08', NULL); -- 1984 at Downtown Library, Not Returned
    `);

    console.log("Initial data inserted successfully!");
  } catch (err) {
    console.error("Error inserting data", err);
  } finally {
    client.end();
  }
};

insertData();
