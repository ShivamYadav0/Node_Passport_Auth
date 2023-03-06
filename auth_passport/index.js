const express = require("express");
const jwt = require('jsonwebtoken');
const passport = require('passport')
var cors = require("cors");
const cookieParser = require("cookie-parser");
require('dotenv').config()
var { connectDB } = require('./db');
require('./passport')
const loginRouter=require("./routers/login")
const registerRouter=require("./routers/register")
const path = require('path')
const port = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
connectDB(DATABASE_URL);

const { User } = require('./models/Dbschema');

var app = express();
app.use(cors({
  origin: true, //included origin as true
  credentials: true, //included credentials as true
}))
app.use('/public',express.static(path.join(__dirname, '/public')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
 app.use(passport.initialize())
app.use(loginRouter)
app.use(registerRouter)
//let current_users={views:0};
app.use('/*',function(req,res,next){
   
   // current_users.views++;
  // console.log(current_users)
  next()
  })
/**
* -------------- GET ROUTES ----------------
*/

app.get('/', (req, res, next) => {
  
  return res.sendFile(path.join(__dirname+'/public/home.html'));
});


app.get('/secret',passport.authenticate('jwt', { session: false }), (req, res, next) => {
  
  let message=req.user;
  current_users.user=message.username;
  message.secret_data="secret data"
  res.json(message)
})

/*
 * Also, look up what behaviour express session has without a maxage set
 */
app.get('/protected-route', passport.authenticate('jwt', { session: false }), (req, res, next) => {
   
  // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
  if (req.isAuthenticated()) {
    return res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
  } else {
    return res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
  }
});


//start listening server

app.listen(port)
