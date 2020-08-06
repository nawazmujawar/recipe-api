const auth = require("express").Router();
const passport = require("passport");
const { response, generateAccessToken } = require("../utils/utils");
auth
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

auth
  .route("/google/callback")
  .get(
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
      const { _id } = req.user;
      const accessToken = generateAccessToken(_id);
      console.log(accessToken);
      const data = { accessToken, user: req.user };
      res.status(200).json(data);
    }
  );

module.exports = auth;
