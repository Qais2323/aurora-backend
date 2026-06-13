const Water = require("../models/Water");

// ADD WATER

const addWater = async (
  req,
  res
) => {
  try {

    const { amount } =
      req.body;

    const water =
      await Water.create({
        amount,
        user: req.user.id,
      });

    res.status(201).json({
      success: true,
      data: water,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// GET WATER LOGS

const getWaterLogs = async (
  req,
  res
) => {
  try {

    const logs =
      await Water.find({
        user: req.user.id,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      data: logs,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  addWater,
  getWaterLogs,
};