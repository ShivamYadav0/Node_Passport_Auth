var express = require("express");
// var jwt=require("jsonwebtoken");
const jwt = require('jsonwebtoken');

const passport = require('passport')
const bcrypt = require('bcrypt')
const session = require("express-session")
var cors = require("cors");
var { connectDB } = require('./db');
require('dotenv').config()
const port = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
connectDB(DATABASE_URL);

var app = express();
app.use(
  session({
    secret: "our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize())
app.use(passport.session())

require('./passport')
const { User } = require('./models/Dbschema');
const cookieParser = require("cookie-parser");
//"mongodb://localhost:27017"


genToken = user => {
  return jwt.sign({
    iss: 'shivam yadav',
    sub: user.id
  }, 'secret_key', { expiresIn: 600000 });
}
let optionsc = {
  httpOnly: true,
  secure: false,
  maxAge: 1000 * 60 * 60 * 24 // would expire after 24 hours
  // The cookie only accessible by the web server
}
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
//app.use(cors())
// TODO

app.post('/login', async (req, res, next) => {
  /////

  const userName = req.body.email;
  const password = req.body.password;
  console.log(userName)
  User.findOne({ 'email': userName })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ userNotFound: "Username not found." });
      }
      else {
        console.log(user)
        bcrypt.compare(password, user.password)
          .then((isMatch) => {
            if (isMatch) {
              const payload = {
                id: user.id,
                name: user.fullName
              };
              const token = genToken(user)


              res.cookie('x-access-token', token, optionsc)
              res.status(200).json({ success: true, token: token });
            }
            else {
              return res.status(400).json({ incorrectPassword: "Password incorrect." });
            }
          })
      }
    });


  /////

});

// TODO
app.post('/register', async (req, res, next) => {
  const { email, password } = req.body;

  //Check If User Exists
  let foundUser = await User.findOne({ email });
  if (foundUser) {
    return res.status(403).json({ error: 'Email is already in use' });
  }
  const hash = await bcrypt.hashSync(password, 10);
  console.log(hash)
  const newUser = await new User({ email, 'password': hash })
  await newUser.save()
  // Generate JWT token
  const token = genToken(newUser)


  res.cookie('x-access-token', token, optionsc)
  //console.log(token);
  res.status(200).json({ token });
});


/**
* -------------- GET ROUTES ----------------
*/

app.get('/', (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a>   <a href="/login">login</a>  <a href="/logout">logout</a></p>');
});



app.get('/secret', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let token = req.cookies['x-access-token'];

  console.log(token);
  res.json("Secret Data")
})




// When you visit http://localhost:3000/login, you will see "Login Page"
app.get('/login', (req, res, next) => {
  var token = req.cookies['x-access-token'];
  var flag;
  console.log(token)
  if (token)
    flag = jwt.verify(token, 'secret_key');
  if (flag && token) {

    res.send('<h1>YOU ARE ALREADY LOGGED IN</h1> <br/>  <a href="/logout">logout</a>')
  }
  else {
    const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="email">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
  }

});

// When you visit http://localhost:3000/register, you will see "Register Page"
app.get('/register', (req, res, next) => {
  var token = req.cookies['x-access-token'];
  var flag;
  console.log(token)
  if (token)
    flag = jwt.verify(token, 'secret_key');
  if (flag && token) {

    res.send('<h1>YOU ARE ALREADY REGISTERED IN</h1> <br/>  <a href="/logout">logout</a>')
  }
  const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="email">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);

});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 * 
 * Also, look up what behaviour express session has without a maxage set
 */
app.get('/protected-route', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
  if (req.isAuthenticated()) {
    res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
  } else {
    res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
  }
});

// Visiting this route logs the user out
app.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.clearCookie('x-access-token');
    res.redirect('/');
  });

});

app.get('/login-success', (req, res, next) => {
  res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

app.get('/login-failure', (req, res, next) => {
  res.send('You entered the wrong password.');
});
app.listen(3000)

/*


const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const passport = require('passport')
require('./passport')
const app = express()
genToken = user => {
  return jwt.sign({
    iss: 'shivam yadav',
    sub: user.id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)
  }, 'secret_key');
}
app.use(bodyParser.json())
app.get('/',(req,res)=>{
  res.send('Hello world')
})
app.get('/secret', passport.authenticate('jwt',{session: false}),(req,res,next)=>{
    res.json("Secret Data")
})

app.post('/register', async function (req, res, next) {
  const { email, password } = req.body;
  
  //Check If User Exists
  let foundUser = await User.findOne({ email });
  if (foundUser) {
    return res.status(403).json({ error: 'Email is already in use'});
  }
 
  const newUser = new User({ email, password})
  await newUser.save()
  // Generate JWT token
  const token = genToken(newUser)
  res.status(200).json({token})
});
mongoose.connect("mongodb://localhost/louji", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once('open',function(){
  console.log('Connected to Mongo');
}).on('error',function(err){
  console.log('Mongo Error', err);
})
app.listen(8000,()=>{
  console.log('Serve is up and running at the port 8000')
})

*/