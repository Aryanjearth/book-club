const readBooksModel = require("../models/readBooks.model.js"); // Import the ReadBooks model
const userModel = require("../models/user.model.js"); // Import the User model

exports.ReadBooks = async (req, res) => {
  try {
    const { userId } = req.body; // Accept userId from request body
    const { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10
    const skip = (page - 1) * limit; // Calculate items to skip based on page number

    // Validate userId
    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "User ID is required to fetch read books.",
      });
    }

    // Check if the user exists
    const user = await userModel.findById(userId).populate({
      path: "readBooks", // Assuming the user has a "readBooks" field that references the ReadBooks model
      options: { skip, limit: parseInt(limit) }, // Apply pagination to read books
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    // If the user has no read books
    if (user.readBooks.length === 0) {
      return res.status(200).send({
        success: false,
        message: "No read books found for this user.",
      });
    }

    // Return the user's read books along with pagination information
    const totalReadBooks = user.readBooks.length; // Get the total number of read books for the user
    res.status(200).send({
      success: true,
      data: user.readBooks,
      message: "User's read books fetched successfully",
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalReadBooks,
      },
    });
  } catch (err) {
    console.error("Error fetching user's read books:", err);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
