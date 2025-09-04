const blogModel = require("../models/blogPage.model");
const userModel = require("../models/user.model");

exports.deleteblog = async (req, res) => {
    const { userId, blogId } = req.body;

    // Validate input
    if (!userId || !blogId) {
        return res.status(400).send({
            success: false,
            message: "UserId or blogId not provided.",
        });
    }

    try {
        // Fetch the user and blog
        const user = await userModel.findById(userId);
        const blog = await blogModel.findById(blogId);

        // Check authorization
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found.",
            });
        }

        if (!blog) {
            return res.status(404).send({
                success: false,
                message: "blog not found.",
            });
        }

        if (user.username === "admin" || blog.originalCreatorId.toString() === userId) {
            // Perform the delete operation for the blog
            await blogModel.deleteOne({ _id: blogId });

            // Remove the blogId from the user's blogIds array
            await userModel.updateMany(
                { blog: blogId },
                { $pull: { blog: blogId } } // Pull removes the blogId from the array
            ); 

            return res.status(200).send({
                success: true,
                message: "blog deleted successfully and removed from user records.",
            });
        } else {
            return res.status(403).send({
                success: false,
                message: "Only admins or the original creator can delete this blog.",
            });
        }
    } catch (err) {
        console.error("Error during blog deletion:", err);
        return res.status(500).send({
            success: false,
            message: "Deletion unsuccessful. Internal server error.",
            error: err.message,
        });
    }
};
