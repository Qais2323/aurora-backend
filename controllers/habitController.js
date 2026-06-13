const Habit = require("../models/Habit");

// GET HABITS

exports.getHabits = async (
  req,
  res
) => {
  try {

    const habits =
      await Habit.find({
        user: req.user.id,
      })
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      data: habits,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};

// ADD HABIT

exports.addHabit = async (
  req,
  res
) => {
  try {

    const habit =
      await Habit.create({
        name: req.body.name,
        user: req.user.id,
      });

    res.status(201).json({
      success: true,
      data: habit,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};

// TOGGLE HABIT

exports.toggleHabit = async (
  req,
  res
) => {
  try {

    const habit =
      await Habit.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!habit) {

      return res.status(404).json({
        success: false,
        message:
          "Habit not found",
      });

    }

    habit.completed =
      !habit.completed;

    if (habit.completed) {
      habit.streak += 1;
    }

    await habit.save();

    res.json({
      success: true,
      data: habit,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};

// DELETE HABIT
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    res.json({
      success: true,
      message: "Habit deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};