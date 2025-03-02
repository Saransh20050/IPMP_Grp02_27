import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load Firebase Admin Credentials
const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// 📌 Delete an author and all their books (DELETE /delete-author)
app.delete("/delete-author", async (req, res) => {
  try {
    const { authorName } = req.body;

    if (!authorName) {
      return res.status(400).json({ error: "Missing author name" });
    }

    // Find the author's ID
    const authorSnapshot = await db.collection("authors").where("name", "==", authorName).get();

    if (authorSnapshot.empty) {
      return res.status(404).json({ error: "Author not found" });
    }

    let authorId = null;
    authorSnapshot.forEach((doc) => {
      authorId = doc.id;
    });

    // Find all books written by the author
    const booksSnapshot = await db.collection("books").where("author_id", "==", authorId).get();

    // Delete all books written by the author
    const deleteBookPromises = [];
    booksSnapshot.forEach((doc) => {
      deleteBookPromises.push(db.collection("books").doc(doc.id).delete());
    });

    await Promise.all(deleteBookPromises);

    // Delete the author
    await db.collection("authors").doc(authorId).delete();

    res.status(200).json({
      message: `Author "${authorName}" and all their books have been deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting author", details: error.message });
  }
});

// 📌 Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
