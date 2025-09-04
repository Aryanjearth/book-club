const clubModel = require("../models/club_create.model");
const userModel = require("../models/user.model");

exports.deleteClub = async (req, res) => {
    const { userId, clubId } = req.body;

    // Validate input
    if (!userId || !clubId) {
        return res.status(400).send({
            success: false,
            message: "UserId or ClubId not provided.",
        });
    }

    try {
        // Fetch the user and club with populated originalCreatorId
        const user = await userModel.findById(userId);
        const club = await clubModel.findById(clubId).populate('originalCreatorId');

        // Check if the user and club exist
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found.",
            });
        }

        if (!club) {
            return res.status(404).send({
                success: false,
                message: "Club not found.",
            });
        }

        // Check if the club's originalCreatorId is defined
        if (!club.originalCreatorId) {
            return res.status(404).send({
                success: false,
                message: "Club creator ID not found.",
            });
        }

        // Debugging: log the values to check if they are correct
        console.log('User ID:', userId);
        console.log('Club Creator ID:', club.originalCreatorId);

        // Check authorization: either admin or the original creator
        if (user.username === "admin" || club.originalCreatorId._id.toString() === userId) {
            // Perform the delete operation for the club
            await clubModel.deleteOne({ _id: clubId });

            // Remove the clubId from the user's clubIds array
            await userModel.updateMany(
                { clubs: clubId },
                { $pull: { clubs: clubId } } // Pull removes the clubId from the array
            );

            return res.status(200).send({
                success: true,
                message: "Club deleted successfully and removed from user records.",
            });
        } else {
            return res.status(403).send({
                success: false,
                message: "Only admins or the original creator can delete this club.",
            });
        }
    } catch (err) {
        console.error("Error during club deletion:", err);
        return res.status(500).send({
            success: false,
            message: "Deletion unsuccessful. Internal server error.",
            error: err.message,
        });
    }
};
