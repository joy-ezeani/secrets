require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");




mongoose.connect('mongodb://127.0.0.1:27017/secretsuserDB', {useNewUrlParser: true})


const { Schema } = mongoose;
const userSchema = new Schema(
    {
        email: String,
        password: String
    }
);


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']  });

const User = mongoose.model('User', userSchema);


app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/register", (req, res)=>{
    res.render("register");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.post("/register", (req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    async function saveNewUser(){
        await  newUser.save().then(function(){
            res.render("secrets");
        }).catch(function(err){
            console.log(err);
        });
    };
   saveNewUser();
    
});

app.post("/login", (req, res)=>{
    const username = req.body.username;
    const  password = req.body.password;

    async function loginUser(){
        await  User.findOne({email: username}).then(function(foundUser){
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }else{
                    res.send("Please confirm your credentials")
                };
            };
        }).catch(function(err){
            console.log(err);
        });
    };
   loginUser();
    
});





app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})