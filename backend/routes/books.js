const express = require("express");
const Book = require("../models/book");

const router = express.Router();

// Escape user input so characters like ( or * can't break the regex search
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Get all books + search
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search) {
      const safeSearch = escapeRegex(search);

      query = {
        $or: [
          { title: { $regex: safeSearch, $options: "i" } },
          { author: { $regex: safeSearch, $options: "i" } },
        ],
      };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    console.error("Get books error:", error);

    res.status(500).json({
      message: "Failed to fetch books",
    });
  }
});

// Add a book
router.post("/", async (req, res) => {
  try {
    const { title, author, category, status } = req.body;

    if (!title || !author || !category) {
      return res.status(400).json({
        message: "Title, author and category are required",
      });
    }

    const book = await Book.create({
      title,
      author,
      category,
      status: status || "Available",
    });

    res.status(201).json({
      message: "Book added successfully",
      book,
    });
  } catch (error) {
    console.error("Add book error:", error);

    res.status(500).json({
      message: "Failed to add book",
    });
  }
});

// Update a book
router.put("/:id", async (req, res) => {
  try {
    const { title, author, category, status } = req.body;

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        category,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json({
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.error("Update book error:", error);

    res.status(500).json({
      message: "Failed to update book",
    });
  }
});

// Delete a book
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Delete book error:", error);

    res.status(500).json({
      message: "Failed to delete book",
    });
  }
});

module.exports = router;