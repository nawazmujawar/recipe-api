const express = require("express");
const router = express.Router({ mergeParams: true });
var Comment = require("../models/comment");
var Recipe = require("../models/recipe");
const recipe = require("../models/recipe");
const checkAuth = require("../middleware/checkAuth");
router.get("/", async (req, res, next) => {
  try {
    const { recipe_id } = req.params;
    if (recipe_id === undefined)
      return res.status(404).send("Recipe not found");
    const comments = await Comment.find({ recipe: recipe_id })
      .populate("user", "username")
      .select("username")
      .exec();
    return res.status(200).json({
      data: comments,
    });
  } catch (error) {
    res.status(404).json({
      error: err,
      message: "Comment not found",
    });
  }
});

router.post("/", checkAuth, async (req, res, next) => {
  /*
  New updated code
  */
  const { recipe_id } = req.params;
  const { comment } = req.body;

  const user = req.user._id;

  if (Object.keys(req.body).length === 0)
    return res.status(404).send("Body required");

  const isRecipePresent = await Recipe.findById(recipe_id)

    .exec()
    .catch((err) =>
      res.status(500).json({
        error: err,
      })
    );

  if (!isRecipePresent)
    return res.status(404).send("Recipe is not in database");

  const commentToSave = new Comment({
    recipe: recipe_id,
    comment: comment,
    user,
  });
  //Update recipe

  const commentSaved = await commentToSave.save().catch((err) => {
    res.status(500).json({
      error: err,
    });
  });

  const commentId = commentToSave._id;

  await Recipe.findByIdAndUpdate(recipe_id, {
    $push: { comment: commentId },
  }).catch((err) =>
    res.status(500).json({
      error: err,
    })
  );

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
      url: `${process.env.HOSTNAME}/api/recipes/${recipe_id}`,
    },
  });
});
router.patch("/:commentId", checkAuth, async (req, res, next) => {
  let id = req.params.commentId;
  let recipeId = req.params.recipeId;
  let userId = req.user._id;
  let change = req.body;
  await Comment.update(
    {
      $and: [{ _id: id }, { user: userId }],
    },
    { $set: change }
  )
    .exec()
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
  return res.status(200).json({
    message: "Comment Updated",
    request: {
      type: "GET",
      url: `${process.env.HOSTNAME}/api/recipes/${recipeId}`,
    },
  });
});
router.delete("/:commentId", checkAuth, async (req, res, next) => {
  const { commentId } = req.params;

  const userId = req.user._id;
  console.log(userId);

  const response = await Comment.findOneAndRemove({
    $and: [{ _id: commentId }, { user: userId }],
  })
    .exec()
    .catch((error) =>
      res.status(500).json({
        error: error,
      })
    );

  if (!response) return res.send("Error");

  return res.status(200).json({
    message: "Comment Deleted",
    deletedComment: response,
  });
});
module.exports = router;
