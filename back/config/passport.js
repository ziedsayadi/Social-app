const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../Models/user");
const passport = require("passport");
const dotenv = require("dotenv");

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

passport.initialize();

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id)
      .then((searchResult) => {
        searchResult ? done(null, searchResult) : done(null, false);
      })
      .catch((err) => {
        return done(err, false)
      });
  })
);
module.exports = isAuth = () =>
  passport.authenticate("jwt", { session: false });
