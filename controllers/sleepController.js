const Sleep = require("../models/Sleep");

// ADD SLEEP

const addSleep = async (
  req,
  res
) => {
  try {

    const { hours } =
      req.body;

    const sleep =
      await Sleep.create({
        hours,
        user: req.user.id,
      });

    res.status(201).json({
      success: true,
      data: sleep,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// GET SLEEP LOGS

const getSleepLogs = async (
  req,
  res
) => {
  try {

    const logs =
      await Sleep.find({
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
  addSleep,
  getSleepLogs,
};