const router=require("express").Router()
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
//get

genToken = user => {
  return jwt.sign({
    iss: 'shivam yadav',
    sub: user.id,
    email:user.email
  }, process.env.jwt_secret, { expiresIn: 600000 });
}

router.get('/register', (req, res, next) => {
    var token = req.cookies['x-access-token'];
    var flag;
    if (token)
      flag = jwt.verify(token, process.env.jwt_secret);
    if (flag && token) {
  
      return res.send('<h1>YOU ARE ALREADY REGISTERED IN</h1> <br/>  <a href="/logout">logout</a>')
    }
    const form = '<h1>Register Page</h1><form method="post" action="register">\
                      Enter Username:<br><input type="text" name="email">\
                      <br>Enter Password:<br><input type="password" name="password">\
                      <br><br><input type="submit" value="Submit"></form>';
  
    return res.send(form);
  
  });

  //post

  router.post('/register', async (req, res, next) => {
   
    try{
    const { email, password } = req.body;
    //Check If User Exists
    let foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(403).json({ error: 'Email is already in use' });
    }
    const hash = await bcrypt.hashSync(password, 10);
    const newUser = await new User({ email, 'password': hash })
    await newUser.save()
    // Generate JWT token
    const token = genToken(newUser)
      res.cookie('x-access-token', token,optionsc)
  
   return res.status(200).json({ token });
  }
  catch(err){
   return res.status(500).send(err)
  }
  });
  
  module.exports=router;