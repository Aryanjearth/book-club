const fetchBook = require("../controllers/fetchBook.controller");




module.exports = (app)=>{
    app.post("/fetchBook/allBooks",fetchBook.fetchBooks)
} 