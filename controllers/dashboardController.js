const Water =
  require("../models/Water");

const Sleep =
  require("../models/Sleep");

const Nutrition =
  require("../models/Nutrition");

const Habit =
  require("../models/Habit");

exports.getDashboard =
  async (req, res) => {
    try {

      const startOfDay =
        new Date();

      startOfDay.setHours(
        0,
        0,
        0,
        0
      );

      const userId =
        req.user.id;

      const waterLogs =
        await Water.find({
          user: userId,
          createdAt: {
            $gte:
              startOfDay,
          },
        });

      const sleepLogs =
        await Sleep.find({
          user: userId,
          createdAt: {
            $gte:
              startOfDay,
          },
        });

      const meals =
        await Nutrition.find({
          user: userId,
          createdAt: {
            $gte:
              startOfDay,
          },
        });

      const habits =
        await Habit.find({
          user: userId,
        });

      const water =
        waterLogs.reduce(
          (
            sum,
            item
          ) =>
            sum +
            item.amount,
          0
        );

      const sleep =
        sleepLogs.reduce(
          (
            sum,
            item
          ) =>
            sum +
            item.hours,
          0
        );

      const calories =
        meals.reduce(
          (
            sum,
            item
          ) =>
            sum +
            item.calories,
          0
        );

      const completedHabits =
        habits.filter(
          (h) =>
            h.completed
        ).length;

      res.json({
        success: true,
        water,
        sleep,
        calories,
        habits:
          completedHabits,
        totalHabits:
          habits.length,
      });

    } catch (error) {

      console.log(
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };