const mongoose = require("mongoose");

const savedSchema = mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admins",
    required: true,
  },

  recipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "receipes",
    },
  ],
});

const SavedRecipeModel = mongoose.model("savedReceipes", savedSchema);

module.exports = SavedRecipeModel;
