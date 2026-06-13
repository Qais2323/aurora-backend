const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
  },

  completed: {
    type: Boolean,
    default: false,
  },

  streak: {
    type: Number,
    default: 0,
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
  "Habit",
  habitSchema
);