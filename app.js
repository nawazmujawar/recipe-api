require("dotenv").config();
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var recipeRouter = require("./api/routes/recipe");
var commentRouter = require("./api/routes/comment");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const passport = require("./api/configs/passport");
const apiRouter = require("./api/routes/index");

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(() => console.log("Database connected"));
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
/* app.use("/recipes", recipeRouter);
app.use("/recipes/:recipe_id/comments", commentRouter); */
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", apiRouter);

/* app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
  });
}); */
module.exports = app;
