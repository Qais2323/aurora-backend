const Nutrition = require("../models/Nutrition");

// ADD MEAL

exports.addMeal = async (
  req,
  res
) => {
  try {

    const meal =
      await Nutrition.create({
        mealName:
          req.body.mealName,

        calories:
          req.body.calories,

        protein:
          req.body.protein,

        carbs:
          req.body.carbs,

        fat:
          req.body.fat,

        user:
          req.user.id,
      });

    res.status(201).json({
      success: true,
      data: meal,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};

// GET MEALS

exports.getMeals = async (
  req,
  res
) => {
  try {

    const meals =
      await Nutrition.find({
        user: req.user.id,
      })
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      data: meals,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};