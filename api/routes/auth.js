const auth = require("express").Router();
const passport = require("passport");
const { response, generateAccessToken } = require("../utils/utils");

const session = require("express-session");

auth.use(
  session({
    secret: "KeyboardKittens",
    resave: true,
    saveUninitialized: true,
  })
);
const addSocketIdToSession = (req, res, next) => {
  req.session.socketId = req.query.socketId;
  next();
};
auth.route("/google").get(
  addSocketIdToSession,
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

auth
  .route("/google/callback")
  .get(
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
      const { _id } = req.user;
      const accessToken = generateAccessToken(_id);
      console.log(accessToken);
      const data = { accessToken, user: req.user };
      io.in(req.session.socketId).emit("user", data);
      // res.end();
      res.status(200).send("Logged in");
    }
  );

module.exports = auth;
