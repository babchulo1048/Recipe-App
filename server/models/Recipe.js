const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instruction: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      type: String,
      required: true,
    },
  ],

  cookingTime: {
    type: Number,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admins",
  },
});

const RecipeModel = mongoose.model("receipes", recipeSchema);

module.exports = RecipeModel;
