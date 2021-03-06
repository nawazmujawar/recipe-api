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

const redisClient = require("./api/configs/redis");

redisClient.once("ready", () => {
  console.log("Connected");
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error(error));
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
module.exports = app;
