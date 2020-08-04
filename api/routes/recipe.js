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
            _id: doc._id,
            name: doc.name,
            duration: doc.duration,
            ingredient: doc.ingredient,
            steps: doc.steps,
            request: {
              type: "GET",
              url: "http://localhost:3000/recipes/" + doc._id,
            },
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
  const recipe = new Recipe({
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
        request: {
          type: "GET",
          url: "http://localhost:3000/recipes/",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:recipeId", (req, res, next) => {
  Recipe.findById(req.params.recipeId)
    .exec()
    .then((response) => {
      res.status(200).json({
        id: response.id,
        name: response.name,
        duration: response.duration,
        ingredient: response.ingredient,
        steps: response.steps,
        request: {
          type: "GET",
          url: "http://localhost:3000/recipes/",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.patch("/:recipeId", (req, res, next) => {
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
            url: "http://localhost:3000/recipes/" + id,
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
});

router.delete("/:recipeId", (req, res, next) => {
  let id = req.params.recipeId;
  Recipe.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Recipe Deleted!",
        request: {
          type: "POST",
          url: "http://localhost:3000/recipes/",
          data: {
            name: "String",
            duration: "Number",
            ingredient: "Array",
            steps: "String",
          },
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
