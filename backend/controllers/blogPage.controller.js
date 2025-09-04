const blogModel = require('../models/blogPage.model');
const userModel = require('../models/user.model');

exports.createBolg = async(req,res) => {
    const { originalCreatorId,Title, Content, Author} = req.body;
    if(!Title || !Content || !Author || !originalCreatorId){
        return res.status(404).send({
            sucess : false,
            message : "tittle, content , Author or creator id is missing"
    });
    
    }
    const trimmedTitle = Title.trim();

    // Check if the title is empty after trimming
    if (trimmedTitle === "") {
        return res.status(400).send({
            success: false,
            message: "Title cannot be empty."
        });
    }

    // Validate the title length (must be no more than 20 words)
    // const titleWords = trimmedTitle.split(/\s+/);
    if (trimmedTitle.length > 200) {
        return res.status(400).send({
            success: false,
            message: "Title cannot exceed 200 words."
        });
    }

    // Check if the title starts with a space
    if (Title.startsWith(' ')) {
        return res.status(400).send({
            success: false,
            message: "Title cannot start with a space."
        });
    }
    const trimmedcontent = Content.trim();
    // Check for consecutive spaces in the title
    if (/ {2,}/.test(trimmedcontent)) {
        return res.status(400).send({
            success: false,
            message: "content cannot contain consecutive spaces."
        });
    }
    if (Content.length > 1000) {
        return res.status(400).send({
            success: false,
            message: "Content cannot exceed 1000 words."
        });
    }
    if (Content.startsWith(' ')) {
        return res.status(400).send({
            success: false,
            message: "content cannot start with a space."
        });
    }
    
    if (Author.startsWith(' ')) {
        return res.status(400).send({
            success: false,
            message: "author cannot start with a space."
        });
    }
    const trimmedauthor = Author.trim();
    // Check for consecutive spaces in the title
    if (/ {2,}/.test(trimmedauthor)) {
        return res.status(400).send({
            success: false,
            message: "author cannot contain consecutive spaces."
        });
    }
    if (Author.length > 100) {
        return res.status(400).send({
            success: false,
            message: "author cannot exceed 100 words."
        });
    }
    try {
        const user = await userModel.findById(originalCreatorId);
        if(!user){
            return res.status(404).send({
                sucess : false,
                message : "user not found"
            })
        }
        const blogCreate = {originalCreatorId, Title , Content , Author};
        const newBlog = await blogModel.create(blogCreate);

        user.blog.push(newBlog._id);
        await user.save();
        
        res.status(201).send({
            success: true,
            data: newBlog,
            message: "Blog created successfully.",
        });

    }
    catch(err){
        console.error("Error creating blog:", err);
        res.status(500).send({
            success: false,
            message: "An error occurred while creating the blog.",
        });
    }
}