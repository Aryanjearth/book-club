const CreateFavorite = require('../controllers/createFavorite.controller');
const authmw = require("../middleware/aurth.mw");  // Fixed typo from 'aurth.mw' to 'auth.mw'
const favorite = require("../controllers/GetFavorite.controller");
const deleteFavorite = require("../controllers/deleteFavorite.controller");
const getPopularBooks = require("../controllers/popularBook.controller");
const addToReadBooks = require("../controllers/readBooks.controller"); // Import the new controller
const getReadBooks = require("../controllers/getReadbooks.controller");
/**
 * Route definitions
 * POST /book_worms/api/v1/auth/favorites       => Creates a favorite
 * GET /book_worms/api/v1/auth/favorites        => Retrieves list of favorites
 * POST /book_worms/api/v1/auth/read-books      => Adds a book to the Read Books collection
 * POST /book_worms/api/v1/auth/deleteFavorite  => Deletes a favorite
 * GET /popular-books/month                    => Retrieves popular books of the month
 */
module.exports = (app) => {
    // Create favorite - using POST and applying auth middleware
    app.post("/book_worms/api/v1/auth/favorites", [authmw.CreateFavorite], CreateFavorite.CreateFavorite);

    // Get list of favorites - retrieves saved books from the database
    app.post("/book_worms/api/v1/auth/getFavorites", favorite.Favorite);
    app.post("/book_worms/api/v1/auth/getReadBooks",getReadBooks.ReadBooks);
    // Add a book to Read Books collection
    app.post("/book_worms/api/v1/auth/read-books", addToReadBooks.addToReadBooks); // Apply auth middleware

    // Get popular books of the month
    app.get('/popular-books/month', getPopularBooks);

    // Delete a favorite
    app.post("/book_worms/api/v1/auth/deleteFavorite", deleteFavorite.deletebook);
};
