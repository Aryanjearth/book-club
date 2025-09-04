const createClub = require('../controllers/club_create.controller')
const aurthmw = require("../middleware/aurth.mw")
const getClubs = require("../controllers/getClubs.controller")
const deleteClub = require("../controllers/deleteClub.controller")
const joinClub = require("../controllers/joinClub.controller")
/**
 * 
 * post   0.0.0.0:8888/book_worms/api/v1/auth/club_create
 */
module.exports = (app) =>{
    app.post("/book_worms/api/v1/auth/club_create",createClub.club_create);
    app.post("/book_worms/api/v1/auth/club_create/getClubs",getClubs.getClubs);
    app.post("/book_worms/api/v1/auth/club_create/getAllClubs",getClubs.getAllClubs);
    app.post("/book_worms/api/v1/auth/deleteClubs",deleteClub.deleteClub);
    app.post("/book_worms/api/v1/auth/joinClub",joinClub.joinClub);
    
}