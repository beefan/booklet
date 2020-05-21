const port = 8080;

/* Express setup */
const express = require('express');
const expressSession = require('express-session')({
  secret: 'ducks have no luck in dry summers',
  resave: false,
  saveUninitialized: false
});
const app = express();
app.use(expressSession);

/* CORS setup */
const cors = require('cors');
app.use(cors());
app.options('*', cors())

/* Body Parser Setup */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/* Passport setup */
const passport = require('passport');
const User = require('./models/user');
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy()); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* Mongoose Setup */
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017', 
  { useNewUrlParser: true, useUnifiedTopology: true });

/* Routes */
require('./routes')(app);

/* LISTEN AT 8080 */
app.listen(port, () => {
  console.log(`booklet listening for requests at http://localhost:${port}`);
});