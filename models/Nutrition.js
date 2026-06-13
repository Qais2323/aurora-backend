const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema(
{
  calories: {
    type: Number,
    required: true,
  },

  protein: {
    type: Number,
    default: 0,
  },

  carbs: {
    type: Number,
    default: 0,
  },

  fat: {
    type: Number,
    default: 0,
  },

  mealName: {
    type: String,
    default: "Meal",
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
},
{
  timestamps: true,
}
);

module.exports = mongoose.model(
  "Nutrition",
  nutritionSchema
);