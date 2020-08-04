const express = require("express");
const router = express.Router({ mergeParams: true });
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

router.post("/", async (req, res, next) => {
  /*
  New updated code
  */
  const { recipe_id } = req.params;
  const { comment } = req.body;

  if (Object.keys(req.body).length === 0)
    return res.status(404).send("Body required");

  const isRecipePresent = await Recipe.findById(recipe_id)
    .exec()
    .catch((err) => console.log(err));

  if (!isRecipePresent)
    return res.status(404).send("Recipe is not in database");

  const commentToSave = new Comment({
    recipe: recipe_id,
    content: comment,
  });

  const commentSaved = await commentToSave
    .save()
    .catch((err) => console.log(err));

  if (!commentSaved) return res.status(404);

  return res.status(201).json({
    statusCode: 201,
    message: "Comment has been added",
    data: {
      comment: commentSaved,
    },
  });

  /* Recipe.findById(req.body.recipeId)
    .exec()
    .then((recipe) => {
      console.log(recipe);
      if (!recipe) {
        res.status(404).json({
          message: "Recipe doesn't exits ",
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
    }); */
});

module.exports = router;
