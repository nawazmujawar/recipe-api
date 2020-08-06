const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.HOSTNAME}/api/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      const email = profile.emails[0].value;
      const username = profile.displayName;
      const profilePicture = profile.photos[0].value;
      const isFound = await User.findOne({ email }).exec();
      if (isFound) return cb(null, isFound);
      const userCreated = await User.create({
        email,
        username,
        profilePicture,
      });
      await userCreated.save();
      return cb(null, userCreated);
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

module.exports = passport;
