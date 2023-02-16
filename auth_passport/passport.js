const passport = require("passport")
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require('bcrypt')
const LocalStrategy = require("passport-local").Strategy
const { User } = require('./models/DBschema')

var cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) token = req.cookies['x-access-token'];

    //token=token.split('.')[1]
    console.log(token)
    return token;
};
var opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.jwt_secret;


passport.use(new LocalStrategy({
 usernameField: 'email',    // define the parameter in req.body that passport can use as username and password
passwordField: 'password'
} ,async function (username, password, cb) {
    
    //Assume there is a DB module pproviding a global User

    return User.findOne({'email':username})
        .then(user => {
            let isMatch = bcrypt.compare(password, user.password);
            if (!user||!isMatch) {
                return cb(null, false, {message: 'Incorrect username or password.'});
            }

            return cb(null, user, {
                message: 'Logged In Successfully'
            });
        })
        .catch(err => {
            return cb(err);
        });
}
));



passport.use(new JWTStrategy(opts,
    async function (jwtPayload, done) {
        return await User.findById(jwtPayload.sub)
            .then(user => {
                return done(null, user);
            })
            .catch(err => {
                return done(err);
            });
    }
))
