//Import modules
const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const {v4: uuidv4} = require('uuid');

//Import MongoDB models
const ActivationToken = require('../models/activationtoken.js');
const CookieModel = require('../models/cookie.js');
const UserModel = require('../models/user.js');

//Global variables
const router = express.Router();
const homeDirectory = path.join(__dirname, '..');

//Connect to MongoDB
//TODO Change the Database name
mongoose.set("strictQuery", false);
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.PROJECT_NAME}`);
var db = mongoose.connection;

//Configure routes

//GET routes
router.get('/', function(req, res){
    res.status(308).redirect('/auth/login');
});
router.get('/login', function(req, res){
    res.status(200).sendFile(`${homeDirectory}/client/Auth/Login/index.html`);
});
router.get('/signup', function(req, res){
    res.status(200).sendFile(`${homeDirectory}/client/Auth/Signup/index.html`);
});
router.get('/logout', function(req, res){
    try{
        res.clearCookie("SID").redirect('/auth/login');
        if(req.cookies?.SID) CookieModel.findOneAndDelete({UUID: req.cookies.SID}).then(function(cookie){});
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
router.get('/verify/:token', async function(req, res){
    try{
        var Token = req.params?.token;
        if(Token){
            var activationToken = await ActivationToken.findOne({Token1: Token});
            if(activationToken){
                //Create a cookie
                var cookie = new CookieModel({
                    UserID: activationToken.UserID,
                    UUID: uuidv4()
                });
                await cookie.save();
                //Send response
                res.status(200).cookie("SID", cookie.UUID).sendFile(`${homeDirectory}/client/Auth/Verify/success.html`);
                //Update the user
                var user = await UserModel.findById(activationToken.UserID);
                user.Activated = true;
                //Remove the expiration
                user.expireAt = undefined;
                await user.save();
            }else{
                //The token has expired or doesn't exist
                res.status(400).sendFile(`${homeDirectory}/client/Auth/Verify/failure.html`);
            }
        }else{
            res.sendStatus(400);
        }
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//POST routes
router.post('/login', async function(req, res){
    try{
        var email = req.body?.Email;
        var password = req.body?.Password;
        if(email && password){
            //Make sure that all variables are strings
            email = email.toString();
            password = password.toString();
            var user = await UserModel.findOne({Email: email});
            if(user?.Password){
                var verification = await bcrypt.compare(password, user.Password);
                if(verification === true){
                    if(user.Activated){
                        var cookie = new CookieModel({
                            UserID: user._id,
                            UUID: uuidv4()
                        });
                        await cookie.save();
                        res.status(200).cookie("SID", cookie.UUID).end();
                    }else{
                        res.status(401).send({Error: "You have to verify your account to log in"});
                    }
                }else{
                    res.status(401).send({Error: "The email and/or the password is wrong"});
                }
            }else{
                res.status(401).send({Error: "The email and/or the password is wrong"});
            }
        }else{
            res.sendStatus(400);
        }
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
router.post('/check-activation', async function(req, res){
    try{
        var token = req.body?.Token;
        if(token){
            var activationToken = await ActivationToken.findOne({Token2: token});
            if(!activationToken){
                //The activation Token has expired
                res.sendStatus(401);
            }else{
                var user = await UserModel.findById(activationToken.UserID);
                if(user?.Activated){
                    res.status(200).send({code: 0}); //The account has been activated
                }else{
                    res.status(200).send({code: 1}); //The account has not been activated
                }
            }
        }else{
            res.sendStatus(400);
        }
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//PUT routes
router.put('/signup', async function(req, res){
    try{
        var username = req.body?.Username;
        var email = req.body?.Email;
        var password = req.body?.Password;
        if(username && email && password){
            //Make sure that all variables are strings
            username = username.toString();
            email = email.toString();
            password = password.toString();
            //Check if there is a user with the same email
            var userWithEmail = await UserModel.findOne({Email: email});
            if(userWithEmail){
                res.status(401).send({error: "This email has already registered an account"});
            }else{
                //Hash password
                var salt = await bcrypt.genSalt(10);
                var passwordHash = await bcrypt.hash(password, salt);
                var User = new UserModel({
                    Username: username,
                    Email: email,
                    Password: passwordHash
                });
                await User.save();
                //Create a verification token
                var Token = new ActivationToken({
                    UserID: User._id,
                    Token1: uuidv4(),
                    Token2: uuidv4()
                });
                await Token.save();
                res.status(200).send({Token: Token.Token2});
                console.log(`Activate account at: https://localhost:${process.env.PORT}/auth/verify/${Token.Token1}`);
            }
        }else{
            res.sendStatus(400);
        }
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Export router
module.exports = router;