//jshint esversion:6

// NOTE : when we create a new user with an email a password and we call save, automatically behind the scenes Mongoose encrypt will encrypt our password field. And when we later on try to find our document based off the email that the user has entered then at this stage Mongoose encrypt will decrypt our password field to be able to check it in this step and see if the user can login.

// using dotenv package
require('dotenv').config();

const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});

// Regular Schema
// const userSchema = {
//     email: String,
//     password: String
// }

// While encrpting
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

// Secret
// const secret = "Thisisourlittlesecret";
// NOTE : Now secret is in .env file

// using encryption
userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ['password']}); //password is field in schema

// creating model
const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res)
{
    res.render("home");
});

app.get("/login",function(req,res)
{
    res.render("login");
});

app.get("/register",function(req,res)
{
    res.render("register");
});

app.post("/register",function(req,res)
{
    const email = req.body.username;
    const password = req.body.password;

    const newUser = new User({
        email: email,
        password: password
    });

    newUser.save(function(err)
    {
        if(err)
        console.log(err);
        else
        res.render("secrets");
    });
});

app.listen(3000,function(req,res)
{
    console.log("Server started at port 3000 ");
})

app.post("/login",function(req,res)
{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err,foundUser)
    {
        if(err)
        console.log(err);
        else
        {
            if(foundUser)
            {
                if(foundUser.password == password)
                {
                    console.log(username+" "+password);
                    res.render("secrets");
                }
                else
                console.log("No user found");
            }
            else
            console.log("No user found");
        }
    });
});