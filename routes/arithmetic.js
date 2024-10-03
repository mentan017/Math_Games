//Import modules
const crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const {v4: uuidv4} = require('uuid');
require('dotenv').config();

//Global variables
const router = express.Router();
const homeDirectory = path.join(__dirname, '..');

//Connect to MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.PROJECT_NAME}`);
var db = mongoose.connection;

//Configure routes

//GET routes
router.get('/', function(req, res){
    res.status(308).redirect('/');
});
router.get('/multiplication', function(req, res){
    res.status(200).sendFile(`${homeDirectory}/client/multiplication/index.html`);
});

function randomInt(min, max){
    return(Math.floor(Math.random()*(max-min+1))+min);
}

//Export router
module.exports = router;