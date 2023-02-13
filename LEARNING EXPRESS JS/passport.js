const passport = require("passport")
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
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
opts.secretOrKey = 'secret_key';

passport.use(new JWTStrategy(opts,
    async function (jwtPayload, done) {
        console.log("shy");
        return await User.findById(jwtPayload.sub)
            .then(user => {
                return done(null, user);
            })
            .catch(err => {
                return done(err);
            });
    }
))
