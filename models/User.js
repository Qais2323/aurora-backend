const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
  googleId: {
  type: String,
  default: "",
},
    profileImage: {
      type: String,
      default: "",
    },

    waterGoal: {
      type: Number,
      default: 2500,
    },

    bedTime: {
      type: String,
      default: "22:00",
    },

    wakeUpTime: {
      type: String,
      default: "06:00",
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    height: {
      type: Number,
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);
