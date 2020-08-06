const express = require("express");
const Router = express.Router();

const recipeRouter = require("./recipe");
const authRouter = require("./auth");
const commentRouter = require("./comment");

console.log("Getting in index");
Router.use("/recipes", recipeRouter);
Router.use("/auth", authRouter);

Router.use("/recipes/:recipe_id/comments", commentRouter);

module.exports = Router;
