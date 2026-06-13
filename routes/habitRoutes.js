const express = require("express");

const router = express.Router();

const {
  getHabits,
  addHabit,
  toggleHabit,
  deleteHabit,
} = require("../controllers/habitController");

const {
  auth,
} = require(
  "../middleware/authMiddleware"
);

router.get("/", auth, getHabits);

router.post("/", auth, addHabit);

router.put("/:id", auth, toggleHabit);

router.delete("/:id", auth, deleteHabit);

module.exports = router;