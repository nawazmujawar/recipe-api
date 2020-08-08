var express = require("express");
const fs = require("fs").promises;
var router = express.Router();
var checkAuth = require("../middleware/checkAuth");

const mongoose = express("mongoose");
var Recipe = require("../models/recipe");

const upload = require("../configs/multer");
const { response, resolveFilePath } = require("../utils/utils");

router.route("/").get((req, res, next) => {
  console.log("Getting");
  Recipe.find()
    .populate("user", "username")
    .exec()
    .then((docs) => {
      console.log(docs);
      //const imagePath = `http://localhost:3000/uploads/${req.file.filename}`;
      res.status(200).json({
        message: "All Recipes",
        length: docs.length,
        recipes: docs.map((doc) => {
          const imagePath = doc.image.toString().replace(/\\/i, "/");
          console.log(imagePath);
          return {
            user: doc.user,
            _id: doc._id,
            name: doc.name,
            duration: doc.duration,
            ingredient: doc.ingredient,
            steps: doc.steps,
            image: `${process.env.HOSTNAME}/${imagePath}`,
            request: {
              type: "GET",
              url: `${process.env.HOSTNAME}/api/recipes/${doc._id}`,
            },
          };
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Something went wrong!",
      });
    });
});

router.route("/").post(checkAuth, upload.single("image"), (req, res, next) => {
  const user = req.user._id;

  const recipe = new Recipe({
    user,
    name: req.body.name,
    duration: req.body.duration,
    ingredient: req.body.ingredient,
    steps: req.body.steps,
    image: req.file.path,
  });
  recipe
    .save()
    .then((response) => {
      res.status(201).json({
        message: "Successfully created recipe",
        request: {
          type: "GET",
          url: `${process.env.HOSTNAME}/api/recipes`,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router
  .route("/:recipeId")
  .get((req, res, next) => {
    Recipe.findById(req.params.recipeId)
      .populate("comment")
      .exec()
      .then((response) => {
        console.log(response);
        res.status(200).json({
          id: response.id,
          name: response.name,
          duration: response.duration,
          ingredient: response.ingredient,
          steps: response.steps,
          comments: response.comment,
          request: {
            type: "GET",
            url: `${process.env.HOSTNAME}/api/recipes`,
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  })
  .patch(checkAuth, (req, res, next) => {
    let id = req.params.recipeId;

    const recipeOps = {};
    for (const ops of req.body) {
      recipeOps[ops.propName] = ops.value;
    }
    Recipe.update({ _id: id }, { $set: recipeOps })
      .exec()
      .then((result) => {
        const response = {
          message: "Recipe is Updated!",
          updatedRecipe: {
            request: {
              type: "GET",
              url: `${process.env.HOSTNAME}/api/recipes/${id}`,
            },
          },
        };
        res.status(201).json(response);
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  })
  .delete(checkAuth, async (req, res, next) => {
    const id = req.params.recipeId;
    const removedRecipe = await Recipe.findByIdAndRemove(id)
      .exec()
      .catch((error) => console.log(error));
    if (!removedRecipe)
      return res.status(404).json(response(404, "Recipe not found", null));
    const filePath = resolveFilePath(removedRecipe.image);
    await fs.unlink(filePath).catch((error) => console.log(error));
    return res.status(200).json(response(200, "Recipe removed", removedRecipe));
  });

module.exports = router;
