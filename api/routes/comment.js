const express = require("express");
const router = express.Router();
const mongoose = express("mongoose");
var Comment = require("../models/comment");
var Recipe = require("../models/recipe");

router.get("/", (req, res, next) => {
  Comment.find()
    .populate("Recipe")
    .exec()
    .then((comments) => {
      res.status(200).json({
        length: comments.length,
        allComments: comments.map((c) => {
          return {
            recipe: c.recipe,
            content: c.content,
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  Recipe.findById(req.body.recipeId)
    .exec()
    .then((recipe) => {
      if (!recipe) {
        res.status(404).json({
          message: "Recipe does'nt exits ",
        });
      }
      const comment = new Comment({
        recipe: req.body.recipe,
        content: req.body.content,
      });
      return comment.save();
    })
    .then((response) => {
      res.status(201).json({
        message: "Comment successfull!",
        commentCreated: {
          _id: response._id,
          recipe: response.recipeId,
          content: response.content,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
