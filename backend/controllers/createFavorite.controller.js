const Favorite = require("../models/Favorite.model");
const User = require("../models/user.model"); // Import the User model

exports.CreateFavorite = async (req, res) => {
  try {
    // 1. Read the request body (expecting full book data and userId)
    const { title, authors, description, publishedDate, imageLinks, buyLink, pdfLink, userId } = req.body;

    // Validate required fields
    if (!title || !authors || !description || !publishedDate || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 2. Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Check if the book already exists in the favorites (use title or any unique field)
    const existingBook = await Favorite.findOne({ title });
    if (existingBook) {
      // Optional: Ensure the book is linked to the user
      if (user.books.includes(existingBook._id)) {
        return res.status(400).json({ message: "This book is already in your favorites" });
      }

      // Link the existing favorite book to the user
      user.books.push(existingBook._id);
      await user.save();

      return res.status(200).json({
        message: "Book already exists in favorites and linked to the user",
        data: existingBook,
      });
    }

    // 4. Format the book data
    const formattedData = {
      title: title || "Unknown Title",
      authors: authors || ["Unknown Author"],
      description: description || "No description available",
      publishedDate: publishedDate || "Unknown",
      imageLink:
        imageLinks?.smallThumbnail || "https://via.placeholder.com/150x200.png?text=No+Image",
      buyLink: buyLink || null,
      pdfLink: pdfLink || null,
    };

    // 5. Insert the formatted book data into MongoDB
    const newFavorite = new Favorite(formattedData);
    const savedBook = await newFavorite.save();

    // 6. Link the new favorite book to the user
    user.books.push(savedBook._id);
    await user.save();

    // 7. Return the saved book as a response
    return res.status(201).json({
      message: "Book added to favorites successfully",
      data: savedBook,
    });

  } catch (error) {
    console.error("Error saving favorite book:", error);
    return res.status(500).json({ message: "Error saving book to database", error });
  }
};
