const ReadBook = require('../models/readBooks.model'); // Import the ReadBook model
const User = require('../models/user.model'); // Import the User model

// Controller function to add a book to the 'Read Books' collection
const addToReadBooks = async (req, res) => {
  const { title, authors, description, publishedDate, imageLink, buyLink, pdfLink, userId } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the book already exists in the Read Books collection
    const existingBook = await ReadBook.findOne({ title });
    if (existingBook) {
      // Ensure the book is linked to the user
      if (user.books.includes(existingBook._id)) {
        return res.status(400).json({ message: "This book is already in your Read Books" });
      }

      // Link the existing book to the user
      

      return res.status(200).json({
        message: "Book already exists in Read Books and linked to the user",
        data: existingBook,
      });
    }

    // If the book doesn't exist in the Read Books collection, create a new ReadBook
    const newReadBook = new ReadBook({
      title,
      authors,
      description,
      publishedDate,
      imageLink,
      buyLink,
      pdfLink,
    });

    // Save the new read book to the database
    await newReadBook.save();

    // Link the new read book to the user
    user.readBooks.push(newReadBook._id);
    await user.save();

    return res.status(201).json({
      message: "Book added to Read Books and linked to the user",
      data: newReadBook,
    });
  } catch (error) {
    console.error('Error adding book to Read Books:', error);
    res.status(500).json({ message: 'Failed to add book to Read Books' });
  }
};

module.exports = { addToReadBooks };
