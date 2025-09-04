const club_create_model = require("../models/club_create.model"); 
const User = require("../models/user.model");

exports.club_create = async (req, res) => {
    const { clubName, description, userId } = req.body;

    // Validate required fields
    if (!clubName || !description || !userId) {
        return res.status(400).send({
            success: false,
            message: "Club name, description, and user ID are required.",
        });
    }
    if (clubName.length > 50) {
        return res.status(400).send({
            success: false,
            message: "clubName cannot exceed 50 words."
        });
    }
    if (clubName.startsWith(' ')) {
        return res.status(400).send({
            success: false,
            message: "clubName cannot start with a space."
        });
    }
    const trimmedclubname = clubName.trim();
    // Check for consecutive spaces in the title
    if (/ {2,}/.test(trimmedclubname)) {
        return res.status(400).send({
            success: false,
            message: "club name cannot contain consecutive spaces."
        });
    }

    if (description.length > 100) {
        return res.status(400).send({
            success: false,
            message: "description cannot exceed 100 words."
        });
    }
    if (description.startsWith(' ')) {
        return res.status(400).send({
            success: false,
            message: "description cannot start with a space."
        });
    }
    const trimmeddescription = description.trim();
    // Check for consecutive spaces in the title
    if (/ {2,}/.test(trimmeddescription)) {
        return res.status(400).send({
            success: false,
            message: "description cannot contain consecutive spaces."
        });
    }
    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found.",
            });
        }
        
        
        
        const existingClub = await club_create_model.findOne({ clubName });
        if (existingClub) {
            return res.status(400).send({
                success: false,
                message: "A club with this name already exists. Please choose a different name.",
            });
        }
    
        // Create and save the club
        const clubData = { originalCreatorId: userId, clubName : clubName, description, users: [userId] };
        const newClub = await club_create_model.create(clubData);
        
       

        // Add the club to the user's clubs array
        user.clubs.push(newClub._id);
        await user.save();

        res.status(201).send({
            success: true,
            data: newClub,
            message: "Club created successfully.",
        });
    } catch (err) {
        console.error("Error creating club:", err);
        res.status(500).send({
            success: false,
            message: "An error occurred while creating the club.",
        });
    }
};
