var express = require("express");
var router = express.Router();
const mongoose = express("mongoose");
var Recipe = require("../models/recipe");

router.get("/", (req, res, next) => {
  Recipe.find()
    .exec()
    .then((docs) => {
      res.status(200).json({
        message: "All Recipes",
        length: docs.length,
        recipes: docs.map((doc) => {
          return {
            id: doc.id,
            name: doc.name,
            duration: doc.duration,
            ingredient: doc.ingredient,
            steps: doc.steps,
          };
        }),
      });
    })
    .catch((err) => {
      res.status(404).json({
        message: "Something went wrong!",
      });
    });
});

router.post("/", (req, res, next) => {
  var recipe = new Recipe({
    name: req.body.name,
    duration: req.body.duration,
    ingredient: req.body.ingredient,
    steps: req.body.steps,
  });
  recipe
    .save()
    .then((response) => {
      res.status(201).json({
        message: "Successfully created recipe",
        recipe: response,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:recipe_id", (req, res, next) => {
  Recipe.findById(req.params.recipe_id)
    .exec()
    .then((response) => {
      res.status(200).json({
        id: response.id,
        name: response.name,
        duration: response.duration,
        ingredient: response.ingredient,
        steps: response.steps,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.patch("/:recipe_id", (req, res, next) => {
  let id = req.params.recipe_id;
  // const recipeOps = {};
  // for (const ops of req.body) {
  //   recipeOps[ops.propName] = ops.value;
  // }
  let recipeOps = req.body;
  Recipe.update({ id: id }, { $set: recipeOps })
    .exec()
    .then((result) => {
      const response = {
        message: "Recipe Updated",
      };
      res.status(201).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
