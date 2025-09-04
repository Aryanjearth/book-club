const express = require("express")
const mongoose = require("mongoose")
const server_cofig = require("./config/server.config")
const db_config = require("./config/db.config")
const user_model = require("./models/user.model")
const bcrypt = require("bcryptjs")

const app = express()
// middle ware
const cors = require('cors');
app.use(cors());

app.use(express.json())

mongoose.connect(db_config.DB_URL , {
    useNewUrlParser : true,
    useUnifiedTopology : true,
})
const db = mongoose.connection

db.on("error",()=>{
    console.log("error while connecting")
})
db.once("connected",()=>{
    console.log("connected to mongoDB")
    init()
})
// a get api example
app.get('/home', (req, res) => {
    res.send('Hello, this is your GET API response!')
});

async function init(){
    try{
        let user = await user_model.findOne({username : "admin"})

        if(user){
            console.log("admin is alrady present")
            return
        }
    }catch(err){
        console.log("an error occured while reading data",err)
    }

    try{
        user = await user_model.create({
            // name : "aryan",
            username : "admin",
            email : "aryan00@gmail.com",

            password : bcrypt.hashSync("welcome1",8)
        })
        console.log("admin created",user)
    }catch(err){
        console.log("an error occured",err)
    }
}

// stich the route to server (calling route and passing app)

require("./routes/auth.route")(app)
require("./routes/club_create.route")(app)
require("./routes/fetchBook.route")(app)
require("./routes/Favorite.route")(app)
require("./routes/blog.route")(app)
/**
 * start the server
 */
app.listen(server_cofig.PORT,()=> {
    console.log("server started at port no : " ,server_cofig.PORT)
})