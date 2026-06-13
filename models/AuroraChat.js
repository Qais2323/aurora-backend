const mongoose = require("mongoose");

const auroraChatSchema =
  new mongoose.Schema(
    {
      question: {
        type: String,
        required: true,
      },

      answer: {
        type: String,
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
      collection:
        "aurora_chats",
    }
  );

module.exports =
  mongoose.model(
    "AuroraChat",
    auroraChatSchema
  );