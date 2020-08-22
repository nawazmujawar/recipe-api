var express = require("express");
const fs = require("fs").promises;
var router = express.Router();
var checkAuth = require("../middleware/checkAuth");

const mongoose = express("mongoose");
var Recipe = require("../models/recipe");

const redisClient = require("../configs/redis");

const upload = require("../configs/multer");
const { response, resolveFilePath } = require("../utils/utils");
const { parse } = require("path");

router.route("/").get((req, res, next) => {
  //const userId = req.user._id;
  const { user } = req.query;
  const { search } = req.query;
  if (search) {
    Recipe.find({ $text: { $search: search } })
      .populate("user")
      .exec()
      .then((docs) => {
        //const imagePath = `http://localhost:3000/uploads/${req.file.filename}`;
        res.status(200).json({
          message: "All Recipes",
          docs,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json({
          message: "Something went wrong!",
        });
      });
  } else if (user) {
    Recipe.find({ user: user })
      .populate("user")
      .exec()
      .then((docs) => {
        console.log(docs);
        //const imagePath = `http://localhost:3000/uploads/${req.file.filename}`;
        res.status(200).json({
          message: "All Recipes",
          docs,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json({
          message: "Something went wrong!",
        });
      });
  } else {
    Recipe.find()
      .populate("user")
      .exec()
      .then((docs) => {
        //const imagePath = `http://localhost:3000/uploads/${req.file.filename}`;
        res.status(200).json({
          message: "All Recipes",
          length: docs.length,
          recipes: docs.map((doc) => {
            const imagePath = doc.image.toString().replace(/\\/i, "/");
            return {
              user: doc.user,
              _id: doc._id,
              name: doc.name,
              duration: doc.duration,
              ingredient: doc.ingredient,
              steps: doc.steps,
              image: `${process.env.HOST}/${imagePath}`,
              request: {
                type: "GET",
                url: `${process.env.HOST}/api/recipes/${doc._id}`,
              },
            };
          }),
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json({
          message: "Recipes not found",
        });
      });
  }
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
          url: `${process.env.HOST}/api/recipes`,
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
      .populate("user")
      .populate("comment")
      .then((response) => {
        // console.log(response);

        redisClient.setex(
          `recipe-${req.params.recipeId}`,
          10,
          JSON.stringify(response)
        );

        redisClient.get(`recipe-${req.params.recipeId}`, (err, response) => {
          if (err) {
            console.log(err);
          }
          if (response) {
            const data = JSON.parse(response);
            res.status(200).json(data);
          } else {
            return res.status(200).json(response);
          }
        });

        /* res.status(200).json({
          id: response.id,
          user: response.user,
          name: response.name,
          image: response.image,
          duration: response.duration,
          ingredient: response.ingredient,
          steps: response.steps,
          comments: response.comment,
          request: {
            type: "GET",
            url: `${process.env.HOST}/api/recipes`,
          },
        }); */
      })
      .catch((err) => {
        res.status(404).json({
          error: err,
          message: "Recipe not found",
        });
      });
  })
  .patch(checkAuth, (req, res, next) => {
    let userId = req.user._id;
    let id = req.params.recipeId;
    Recipe.update(
      { $and: [{ _id: id }, { user: userId }] },
      { $set: req.body },
      {
        new: true,
      }
    )
      .then((recipe) => {
        return res.status(200).json({
          recipe,
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({
          error,
        });
      });
  })
  .delete(checkAuth, async (req, res, next) => {
    const id = req.params.recipeId;
    const userId = req.user._id;
    const removedRecipe = await Recipe.findOneAndRemove({
      $and: [{ _id: id }, { user: userId }],
    })
      .exec()
      .catch((error) =>
        res.status(500).json({
          error: err,
        })
      );
    if (!removedRecipe)
      return res.status(404).json(response(404, "Recipe not found", null));
    const filePath = resolveFilePath(removedRecipe.image);
    await fs.unlink(filePath).catch((error) => console.log(error));
    return res.status(200).json(response(200, "Recipe removed", removedRecipe));
  });

module.exports = router;
