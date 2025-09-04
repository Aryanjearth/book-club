
const blogController = require('../controllers/blogPage.controller');
const aurthmw = require("../middleware/aurth.mw")
const getBlogs = require("../controllers/getBlog.controller")
const getAllBlog = require("../controllers/getBlog.controller")
const deleteBlog = require("../controllers/deleteBlogs.controller")
const searchedBlog = require("../controllers/SearchBlog.controller")
/**
 * 
 * post   0.0.0.0:8888/book_worms/api/v1/auth/club_create
 */
module.exports = (app) =>{
    app.post("/book_worms/api/v1/auth/blogCreate",blogController.createBolg);
    // app.post("/book_worms/api/v1/auth/getBlogs",getBlogs.getBlogs);
    app.post("/book_worms/api/v1/auth/getAllBlogs",getAllBlog.getAllBlogs);
    app.post("/book_worms/api/v1/auth/deleteBlogs",deleteBlog.deleteblog);
    app.post("/book_worms/api/v1/auth/searchedBlogs",searchedBlog.SearchBlog)
    
}