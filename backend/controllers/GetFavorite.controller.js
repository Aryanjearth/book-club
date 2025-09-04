const favoriteModel = require("../models/Favorite.model.js");
const userModel = require("../models/user.model.js"); // Import the User model

exports.Favorite = async (req, res) => {
  try {
    const { userId } = req.body; // Accept userId from query parameters
    const { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10
    const skip = (page - 1) * limit; // Calculate items to skip based on page number

    // Validate userId
    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "User ID is required to fetch favorite books.",
      });
    }

    // Check if the user exists
    const user = await userModel.findById(userId).populate({
      path: "books",
      options: { skip, limit: parseInt(limit) }, // Apply pagination to books
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    // If the user has no favorite books
    if (user.books.length === 0) {
      return res.status(200).send({
        success: false,
        message: "No favorite books found for this user.",
      });
    }

    // Return the user's favorite books along with pagination information
    const totalFavorites = user.books.length; // Get the total number of favorite books for the user
    res.status(200).send({
      success: true,
      data: user.books,
      message: "User's favorite books fetched successfully",
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalFavorites,
      },
    });
  } catch (err) {
    console.error("Error fetching user's favorite books:", err);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
