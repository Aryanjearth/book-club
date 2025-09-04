const bookModel = require("../models/Favorite.model");
const userModel = require("../models/user.model");

exports.deletebook = async (req, res) => {
    const { userId, bookId } = req.body;

    // Validate input
    if (!userId || !bookId) {
        return res.status(400).send({
            success: false,
            message: "UserId or bookId not provided.",
        });
    }

    try {
        // Fetch the user and book
        const user = await userModel.findById(userId);
        const book = await bookModel.findById(bookId);
        // console.log('User ID:', userId);
        // console.log('book Creator ID:', book.originalCreatorId.toString());

        // Check authorization
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found.",
            });
        }

        if (!book) {
            return res.status(404).send({
                success: false,
                message: "book not found.",
            });
        }

       
            // Perform the delete operation for the book
            await bookModel.deleteOne({ _id: bookId });

            // Remove the bookId from the user's bookIds array
            await userModel.updateMany(
                { books: bookId },
                { $pull: { books: bookId } } // Pull removes the bookId from the array
            ); 

            return res.status(200).send({
                success: true,
                message: "book deleted successfully and removed from user records.",
            });
        
    } catch (err) {
        console.error("Error during book deletion:", err);
        return res.status(500).send({
            success: false,
            message: "Deletion unsuccessful. Internal server error.",
            error: err.message,
        });
    }
};
