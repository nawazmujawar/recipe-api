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
      res.status(200).json(
        response(200, "Authentication successful", {
          accessToken,
          user: req.user,
        })
      );
    }
  );

module.exports = auth;
