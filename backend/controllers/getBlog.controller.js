const blogModel = require("../models/blogPage.model.js");
const userModel = require("../models/user.model.js"); // Import the User model

// exports.getBlogs = async (req, res) => {
//   try {
//     const { originalCreatorId } = req.body; // Accept originalCreatorId from query parameters
//     const { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10
//     const skip = (page - 1) * limit; // Calculate items to skip based on page number

//     // Validate originalCreatorId
//     if (!originalCreatorId) {
//       return res.status(400).send({
//         success: false,
//         message: "User ID is required to fetch blogs.",
//       });
//     }

//     // Check if the user exists
//     const user = await userModel.findById(originalCreatorId).populate({
//       path: "blog", // Populating blog posts for the user
//       options: { skip, limit: parseInt(limit) }, // Apply pagination to blogs
//     });

//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     // If the user has no blogs
//     if (!user.blog || user.blog.length === 0) {
//       return res.status(200).send({
//         success: false,
//         message: "No blogs found for this user.",
//       });
//     }

//     // Count total number of blogs for pagination
//     const totalBlogs = await blogModel.countDocuments({ creator: originalCreatorId }); // Count blogs for user by creatorId
    
//     res.status(200).send({
//       success: true,
//       data: user.blog, // Return the list of blogs
//       message: "User's blogs fetched successfully",
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total: totalBlogs, // Total number of blogs in the database
//       },
//     });
//   } catch (err) {
//     console.error("Error fetching user's blogs:", err);
//     res.status(500).send({
//       success: false,
//       message: "Internal server error",
//       error: err.message,
//     });
//   }
// };
exports.getAllBlogs = async (req, res) => {
  try {
    // Fetch all blogs from the database
    const allBlogs = await blogModel.find();

    // Check if no blogs are found
    if (allBlogs.length === 0) {
      return res.status(404).send({
        success: true,
        data: [],
        message: "No blogs found.",
      });
    }

    // Return all blogs
    res.status(200).send({
      success: true,
      data: allBlogs,
      message: "All blogs fetched successfully.",
    });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).send({
      success: false,
      message: "Internal server error.",
      error: err.message,
    });
  }
};

