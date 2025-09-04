const user_model = require("../models/user.model")
const jwt = require("jsonwebtoken")
const auth_config = require("../config/auth.config")
const { response } = require("express")
// checks if req body is proper and correct


const verifySignUpBody = async (req, res, next) => {
    try {
        const { email, username } = req.body;
        
        // Check if email and username are provided
        if (!email) {
            return res.status(400).send({ message: "Email is required." });
        }
        if (!username) {
            return res.status(400).send({ message: "Username is required." });
        }
        if (!/[a-zA-Z]/.test(username)) {
            return res.status(400).send({ message: "Username must contain at least one letter." });
        }
        // Check if user already exists
        const userByUsername = await user_model.findOne({ username });
        if (userByUsername) {
            return res.status(400).send({ message: "Username already exists." });
        }

        const userByEmail = await user_model.findOne({ email });
        if (userByEmail) {
            return res.status(400).send({ message: "Email already exists." });
        }

        next(); // Proceed to next middleware or route handler
    } catch (err) {
        console.log("Error occurred while verifying signup data", err);
        res.status(500).send({ message: "Error while validating the user" });
    }
};

const verifySignInBody = async (req, res, next) => {
    if (!req.body.email) {
        return res.status(400).send({ message: "Email not provided" });
    }
    if (!req.body.password) {
        return res.status(400).send({ message: "Password not provided" });
    }
    next(); // Proceed to next middleware or route handler
};


const verifiyToken = (req,res,next) => {
    // check if token exist 
    const token = req.headers['x-access-token']
    if(!token){
        return res.status(403).send({
            message : "Unautherised! token not present"
        })
    }
    // check if token is valid
    jwt.verify(token,auth_config.secret,async (err,decoded) =>{
    if(err){
        return res.status(401).send({
            message : "Unautherised"
        })
    }
    // check is user is valid

    const user = await user_model.findOne({userType : req.body.userType})
    if(!user){
        return res.status(401).send({
            message : "unautherised! user not valid"
        })
        }
        req.user = user
        next()
    }) 
   
}

const isAdmin = async(req,res,next) => {
    const userId = req.body.userId

    const user = await user_model.findById(userId)
    if(user && user.username === "admin"){
        next()
    }else{
        res.status(401).send({
            message : "Unautherised! only admins can  do this task"
        })
    }
}
const club_create = async(req,res,next) =>{
    try{
        const {clubName , description} = req.body
        if(clubName == null){
            res.status(404).send({
                message : "clubName not provided",
                data : response
            })
        };
        if(description == null){
            res.status(404).send({
                message : "description not provided",
                data : response
            })
        }
        const user = await user_model.findOne({clubName : req.body.clubName})
            if(user){
                return res.status(400).send({
                    message : "failed ! club already exist"
                })

            }
            next()
    }catch{
        console.log("error occured while verifiyng the object",err)
        res.status(500).send({
            message : "err"
        })
    }

}
const CreateFavorite = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        // Validate that the title and description are provided
        if (!title || title.trim() === '') {
            return res.status(400).send({
                message: "Title is required",
                data: null,
            });
        }

        if (!description || description.trim() === '') {
            return res.status(400).send({
                message: "Description is required",
                data: null,
            });
        }

        // If validation passes, proceed to the next middleware/controller
        next();
    } catch (err) {
        console.error("Error occurred while verifying the object:", err);
        res.status(500).send({
            message: "An error occurred while processing the request",
            error: err.message,
        });
    }
};
const blogCreate = async(req,res,next) =>{
    try{
        const {Title,Content,Author} = req.body
        if(Title == null){
            res.status(404).send({
                message : "Title not provided",
                data : response
            })
        };
        if(Content == null){
            res.status(404).send({
                message : "Content not provided",
                data : response
            })
        }
        if(Author == null){
            res.status(404).send({
                message : "Author not provided",
                data : response
            })
        }
        
        next()
    }catch{
        console.log("error occured while verifiyng the object",err)
        res.status(500).send({
            message : "err"
        })
    }

};

module.exports = {
    verifySignUpbody : verifySignUpBody,
    verifySignInBody : verifySignInBody,
    verifiyToken : verifiyToken,
    isAdmin : isAdmin,
    club_create : club_create,
    CreateFavorite : CreateFavorite,
    blogCreate : blogCreate
}