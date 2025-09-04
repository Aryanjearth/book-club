// auth.routes.js

const authController = require("../controllers/auth.controller");
const authMw = require("../middleware/aurth.mw");

module.exports = (app) => {
    app.post("/book_worms/api/v1/auth/signup", [authMw.verifySignUpbody], authController.signup);
    app.post("/book_worms/api/v1/auth/signin", [authMw.verifySignInBody], authController.signin);
};
