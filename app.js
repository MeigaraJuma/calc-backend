const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connect to database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database'+config.database);
});

// Error Checking
mongoose.connection.on('error', (err) => {
    console.log('Database error'+err);
});

// Declaring app as express
const app = express();

// Import users from routes/users
const users = require('./routes/users');

// Port Number for Debugging
const port = 3000;

// Port Number for Deploying (to Heroku)
// const port = process.env.PORT || 8080;

// CORS Middleware
app.use(cors());

// Morgan for checking response
app.use(morgan('dev'));

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middlecore
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Users Route
app.use('/users', users);

// Index Route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
 });

// Make sure everything to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start server
app.listen(port, () => {
    console.log('Server started on port '+port);
});
