

const router = require("express").Router()
const jwt = require('jsonwebtoken');
const passport = require('passport')
const bcrypt = require('bcrypt')
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
    const form = '<h1>Login Page</h1><form method="POST" action="/login">\
      Enter Username:<br><input type="text" name="email">\
      <br>Enter Password:<br><input type="password" name="password">\
      <br><br><input type="submit" value="Submit"></form>';

    return res.send(form);
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

      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }

        const token = genToken(user)

        res.cookie('x-access-token', token, optionsc)
       return res.status(200).json({ success: true, token: token });

      });
    })
      (req, res);

  }
  catch (err) {
    return res.status(500).send(err)
  }

});

module.exports = router;