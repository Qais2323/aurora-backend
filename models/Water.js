const mongoose = require("mongoose");

const waterSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "water_logs",
  }
);

module.exports = mongoose.model(
  "Water",
  waterSchema
);