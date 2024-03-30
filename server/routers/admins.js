const express = require("express");
const mongoose = require("mongoose");
const AdminModel = require("../models/Admin");
const RecipeModel = require("../models/Recipe");
const SavedRecipeModel = require("../models/SavedRecipe");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();
router.use(express.json());

const upload = multer({ dest: "uploads/" });
router.use(express.json());

router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

router.post("/register", async (req, res) => {
  const { name, password } = req.body;
  const admin = await AdminModel.findOne({ name });

  try {
    if (admin) {
      return res.json({ message: "User Already Exist" });
    }
    const newAdmin = new AdminModel({ name, password });
    await newAdmin.save();

    res.status(200).json({ message: "new Admin created", data: newAdmin });
  } catch (ex) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const admin = await AdminModel.findOne({ name });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (password !== admin.password) {
      return res.status(401).json({ message: "Password is invalid" });
    }

    const token = jwt.sign({ id: admin._id }, "eyu123recipecreat36", {
      expiresIn: "1h",
    });

    res.json({ token, adminId: admin._id });
  } catch (ex) {
    // console.error("Error during login:", ex);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/createRecipe", upload.single("file"), async (req, res) => {
  const { name, description, instruction, imageUrl, ingredients, cookingTime } =
    req.body;
  let image;

  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    image = newPath;
  } else {
    image = imageUrl;
  }

  try {
    const recipe = new RecipeModel({
      name,
      description,
      instruction,
      imageUrl: image,
      ingredients,
      cookingTime,
    });
    await recipe.save();

    res.status(200).json({ message: "New Recipe Created ", data: recipe });
  } catch (ex) {
    // console.log(ex);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/savedRecipes/:id", async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.body;

  try {
    const savedRecipe = await SavedRecipeModel.findOneAndUpdate(
      { admin: new mongoose.Types.ObjectId(adminId) },

      // { admin: mongoose.Types.ObjectId(adminId) },
      { $addToSet: { recipes: id } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "admin & recipe are associated",
      data: savedRecipe,
    });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/savedRecipe/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const savedReceipes = await SavedRecipeModel.find({
      admin: id,
    }).populate("recipes");

    res.status(200).json({ data: savedReceipes });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/savedRecipe/:id", async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.body;

  try {
    const updatedSavedRecipes = await SavedRecipeModel.findOneAndUpdate(
      { admin: adminId },
      { $pull: { recipes: id } },
      { new: true }
    ).populate("recipes");

    res.status(200).json({ data: updatedSavedRecipes });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/getReceipes", async (req, res) => {
  try {
    const receipes = await RecipeModel.find({}).populate("admin", ["name"]);

    res.status(200).json({ data: receipes });
  } catch (ex) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/recipes/:id/admin", async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.body;
  try {
    const recipe = await RecipeModel.findByIdAndUpdate(
      id,
      { admin: adminId },
      { new: true }
    );

    if (!recipe) {
      return res.status(404).json({ message: "recipe with id not found" });
    }

    res
      .status(200)
      .json({ message: "recipe associated with the admin successfully" });
  } catch (ex) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/recipe/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const recipe = await RecipeModel.findOne({ _id: id }).populate(
      "admin",
      "name"
    );

    if (!recipe) {
      return res.status(404).json({ message: "Recipe with id not found" });
    }

    res.status(200).json({ data: recipe });
  } catch (ex) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/recipe/:id", upload.single("file"), async (req, res) => {
  const { id } = req.params;
  const { name, description, instruction, imageUrl, ingredients, cookingTime } =
    req.body;
  let image;

  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    image = newPath;
  } else {
    image = imageUrl;
  }

  try {
    const recipe = await RecipeModel.findByIdAndUpdate(
      { _id: id },
      {
        name,
        description,
        instruction,
        imageUrl: image,
        ingredients,
        cookingTime,
      },
      {
        new: true,
      }
    );

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const updatedRecipe = await RecipeModel.findById(id).populate("admin", [
      "name",
    ]);

    res
      .status(200)
      .json({ message: "Recipes successfully updated", data: updatedRecipe });
  } catch (ex) {
    // console.log(ex);
    res.status(500).json({ message: "Recipe not found" });
  }
});

router.delete("/recipe/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const recipe = await RecipeModel.findByIdAndDelete({ _id: id });

    // console.log(recipe);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const recipes = await RecipeModel.find({});

    res
      .status(200)
      .json({ message: "Recipe deleted successfully", data: recipes });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = { AdminRouter: router };
