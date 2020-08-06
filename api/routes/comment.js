const express = require("express");
const router = express.Router({ mergeParams: true });
var Comment = require("../models/comment");
var Recipe = require("../models/recipe");

router.get("/", async (req, res, next) => {
  try {
    const { recipe_id } = req.params;
    if (recipe_id === undefined)
      return res.status(404).send("Recipe not found");
    const comments = await Comment.find({ recipe: recipe_id }).exec();
    return res.status(200).json({
      data: comments,
    });
  } catch (error) {
    console.log(error);
  }
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
    comment: comment,
  });
  //Update recipe

  const commentSaved = await commentToSave
    .save()
    .catch((err) => console.log(err));

  const commentId = commentToSave._id;

  await Recipe.findByIdAndUpdate(recipe_id, {
    $push: { comment: commentId },
  }).catch((err) => console.log(err));

  if (!commentSaved)
    return res.status(404).json({
      message: "Something went wrong",
    });

  return res.status(201).json({
    statusCode: 201,
    message: "Comment has been added",
    data: {
      comment: commentSaved,
    },
  });
});

router.delete("/:commentId", async (req, res, next) => {
  const response = await Comment.remove(req.params.commentId)
    .exec()
    .catch(console.error);
  return res.status(200).json({
    message: "Comment Deleted",
  });
});
module.exports = router;
