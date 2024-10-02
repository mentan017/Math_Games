//Import modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const {v4: uuidv4} = require('uuid');
require('dotenv').config();

//Import routes
const ArithmeticRouter = require('./arithmetic.js');

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

//Connect routes
router.use('/arithmetic', ArithmeticRouter)

//Export router
module.exports = router;