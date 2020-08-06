const express = require("express");
const router = express.Router({ mergeParams: true });
var Comment = require("../models/comment");
var Recipe = require("../models/recipe");
const recipe = require("../models/recipe");

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

router.post("/", checkAuth, async (req, res, next) => {
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
    request: {
      type: "GET",
      url: "http://localhost:3000/recipes/" + recipe,
    },
  });
});
router.patch("/:commentId", checkAuth, async (req, res, next) => {
  let id = req.params.commentId;
  let recipeId = req.params.recipeId;
  const commentOps = {};
  for (const ops of req.body) {
    commentOps[ops.propName] = ops.value;
  }
  Comment.update({ _id: id }, { $set: commentOps }).exec().catch(console.error);
  return res.status(200).json({
    message: "Comment Updated",
    request: {
      type: "GET",
      url: "http://localhost:3000/recipes/" + recipeId,
    },
  });
});
router.delete("/:commentId", checkAuth, async (req, res, next) => {
  const response = await Comment.remove(req.params.commentId)
    .exec()
    .catch(console.error);
  return res.status(200).json({
    message: "Comment Deleted",
    deletedComment: response,
  });
});
module.exports = router;
