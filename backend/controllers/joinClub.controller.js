const User = require("../models/user.model"); // Assuming the User model is in the models directory
const Club = require("../models/club_create.model"); // Assuming you have a Club model

const joinClub = async (req, res) => {
  try {
    const { userId, clubId } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Check if the user is already part of the club
    if (user.clubs.includes(clubId)) {
      return res.status(400).json({ message: "User already a member of this club" });
    }

    // Add the club to the user's list of clubs
    user.clubs.push(clubId);
    await user.save();

    res.status(200).json({ message: "Successfully joined the club", user });
  } catch (error) {
    console.error("Error joining club:", error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

module.exports = {
  joinClub,
};
