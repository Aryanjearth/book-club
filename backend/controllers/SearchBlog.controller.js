const blogModel = require("../models/blogPage.model");

exports.SearchBlog = async (req, res) => {
  const { Title } = req.body;

  if (!Title) {
    return res.status(404).send({
      success: false,
      message: "Title not provided",
    });
  }

  try {
    // Create a case-insensitive regex pattern for the Title and Content fields
    const regex = new RegExp(Title, 'i'); // 'i' flag for case-insensitivity

    // Search for blogs where the Title or Content matches the regex
    const blogs = await blogModel.find({
      $or: [
        { Title: { $regex: regex } }, // Match Title (case-insensitive)
        { Content: { $regex: regex } }, // Match Content (case-insensitive)
      ],
    }).sort({ Title: 1 }); // Sort by Title in ascending order (1 means ascending)

    if (!blogs || blogs.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Blog with this title or description not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Blogs found successfully",
      data: blogs,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      success: false,
      data: err,
      message: "Error fetching searched blogs",
    });
  }
};
