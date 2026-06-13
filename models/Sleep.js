const mongoose = require("mongoose");

const sleepSchema = new mongoose.Schema(
  {
    hours: {
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
    collection: "sleep_logs",
  }
);

module.exports = mongoose.model(
  "Sleep",
  sleepSchema
);