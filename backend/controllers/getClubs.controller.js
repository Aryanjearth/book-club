const club_create_model = require("../models/club_create.model");
const user_model = require("../models/user.model")



exports.getClubs = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "User ID is required.",
      });
    }

    // Find the user and populate the clubs field
    const user = await user_model.findById(userId).populate('clubs');

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    // Return the populated user with clubs
    res.status(200).send({
      success: true,
      data: user.clubs, // This will be an array of populated Club documents
      message: "Clubs fetched successfully for the user.",
    });
  } catch (err) {
    console.error("Error fetching clubs for user:", err);
    res.status(500).send({
      success: false,
      message: "Internal server error.",
      error: err.message,
    });
  }
};


// For admin only
exports.getAllClubs = async (req, res) => {
  try {
    // Fetch all clubs from the database
    const allClubs = await club_create_model.find();

    // Check if no clubs are found
    if (allClubs.length === 0) {
      return res.status(200).send({
        success: true,
        data: [],
        message: "No clubs found.",
      });
    }

    // Return all clubs
    res.status(200).send({
      success: true,
      data: allClubs,
      message: "All clubs fetched successfully.",
    });
  } catch (err) {
    console.error("Error fetching clubs:", err);
    res.status(500).send({
      success: false,
      message: "Internal server error.",
      error: err.message,
    });
  }
};
