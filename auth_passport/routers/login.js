

const router = require("express").Router()
const jwt = require('jsonwebtoken');
const passport = require('passport')
const bcrypt = require('bcrypt')
const path = require('path')
require('dotenv').config()
const { User } = require('../models/Dbschema');

let optionsc = {
  httpOnly: true,
  secure: false,
  maxAge: 1000 * 60 * 10 // would expire after 10 min
  // The cookie only accessible by the web server
}


genToken = user => {
  return jwt.sign({
    iss: 'shivam yadav',
    sub: user.id,
    email: user.email
  }, process.env.jwt_secret, { expiresIn: 600000 });
}

//get


router.get('/login', (req, res, next) => {
  var token = req.cookies['x-access-token'];
  var flag;
  if (token)
    flag = jwt.verify(token, process.env.jwt_secret);
  if (flag && token) {

    return res.send('<h1>YOU ARE ALREADY LOGGED IN</h1> <br/>  <a href="/logout">logout</a>')
  }
  else {
    
      res.sendFile(path.join(__dirname+'../../public/login.html'));
  }
});


router.get('/logout', (req, res, next) => {
try{
  req.logout();
    res.setHeader("Clear-Site-Data", "\"cache\"");
    res.clearCookie('x-access-token');
    res.clearCookie()
   return res.redirect('/');
  
}
catch(err){
  return res.status(500).send(err)
}
});

router.get('/login-success', (req, res, next) => {
  res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
  res.send('You entered the wrong password.');
});


//post

router.post('/login', async (req, res, next) => {
  try {
    passport.authenticate('local', { session: false }, (err, user, info) => {

      if (err || !user) {
        return res.status(400).json({
          message: info ? info.message : 'Login failed',
          user: user
        });
      }
     // user.password="shivam"

      req.login(user, { session: false }, (err) => {
        console.log("log",req.user)
        if (err) {
          res.send(err);
        }
  
        const token = genToken(user)
       
        res.cookie('x-access-token', token, optionsc)
       
        return res.status(200).redirect('/')

      });
    })
      (req, res);

  }
  catch (err) {
    return res.status(500).send(err)
  }

});

module.exports = router;