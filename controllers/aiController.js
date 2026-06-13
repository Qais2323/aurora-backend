const { GoogleGenerativeAI } = require("@google/generative-ai");

const AuroraChat = require("../models/AuroraChat");
const Water = require("../models/Water");
const Sleep = require("../models/Sleep");
const Nutrition = require("../models/Nutrition");
const Habit = require("../models/Habit");
const User = require("../models/User");

// ASK AURORA

exports.askAurora = async (req, res) => {
  try {

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY not found in .env",
      });
    }

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const lowerPrompt = prompt.toLowerCase();


    
    // WEEKLY SUMMARY ACTION

if (
  lowerPrompt.includes("this week") ||
  lowerPrompt.includes("weekly summary") ||
  lowerPrompt.includes("how am i doing this week")
) {

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const weekWater = await Water.find({
    user: req.user.id,
    createdAt: {
      $gte: lastWeek,
    },
  });

  const weekSleep = await Sleep.find({
    user: req.user.id,
    createdAt: {
      $gte: lastWeek,
    },
  });

  const weekHabits = await Habit.find({
    user: req.user.id,
  });

  const totalWater =
    weekWater.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );

  const avgWater =
    Math.round(
      totalWater / 7
    );

  const weeklyWaterGoal =
    2500 * 7;

  const waterAchievement =
    Math.round(
      (totalWater /
        weeklyWaterGoal) *
        100
    );

  const avgSleep =
    weekSleep.length > 0
      ? (
          weekSleep.reduce(
            (sum, item) =>
              sum +
              item.hours,
            0
          ) /
          weekSleep.length
        ).toFixed(1)
      : 0;

  const sleepAchievement =
    Math.round(
      (avgSleep / 8) *
        100
    );

  const completedHabits =
    weekHabits.filter(
      (h) =>
        h.completed
    ).length;



  const habitAchievement =
    weekHabits.length > 0
      ? Math.round(
          (completedHabits /
            weekHabits.length) *
            100
        )
      : 0;

  const reply =
`
This week you drank ${totalWater} ml water.

Average daily water intake: ${avgWater} ml.

Hydration goal achievement: ${waterAchievement}%.

Average sleep: ${avgSleep} hours.

Sleep goal achievement: ${sleepAchievement}%.

Habits completed: ${completedHabits}/${weekHabits.length}.

Habit completion rate: ${habitAchievement}%.

Keep focusing on consistency and try improving any area below your target.
`;

  await AuroraChat.create({
    user: req.user.id,
    question: prompt,
    answer: reply,
  });

  return res.json({
    success: true,
    reply,
  });

}

    // WATER ACTION

    const waterMatch = lowerPrompt.match(/(\d+)\s*(ml|water)/);
if (lowerPrompt.includes("drank") && waterMatch) {

  const amount = Number(waterMatch[1]);

  await Water.create({
    user: req.user.id,
    amount,
  });

  const reply =
    `Great ${user.name}! I've added ${amount}ml to today's hydration progress.`;

  await AuroraChat.create({
    user: req.user.id,
    question: prompt,
    answer: reply,
  });

  return res.json({
    success: true,
    reply,
  });

}

    // SLEEP ACTION

    const sleepMatch = lowerPrompt.match(/(\d+)\s*hours?/);
if (lowerPrompt.includes("slept") && sleepMatch) {

  const hours = Number(sleepMatch[1]);

  await Sleep.create({
    user: req.user.id,
    hours,
  });

  const reply =
    `I've updated your sleep log with ${hours} hours.`;

  await AuroraChat.create({
    user: req.user.id,
    question: prompt,
    answer: reply,
  });

  return res.json({
    success: true,
    reply,
  });

}
    // HABIT ACTION
    if (
  lowerPrompt.includes("habit") &&
  (
    lowerPrompt.includes("create") ||
    lowerPrompt.includes("add")
  )
)

    {

  const habitName = prompt
    .replace(/create habit/i, "")
    .replace(/add habit/i, "")
    .trim();

  if (habitName) {

    await Habit.create({
      user: req.user.id,
      name: habitName,
    });

    const reply =
      `Done! I've created the habit "${habitName}".`;

    await AuroraChat.create({
      user: req.user.id,
      question: prompt,
      answer: reply,
    });

    return res.json({
      success: true,
      reply,
    });

  }

}

    // GEMINI AI RESPONSE

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // TODAY WATER

    const waterLogs = await Water.find({
      user: req.user.id,
      createdAt: { $gte: startOfDay },
    });

    // TODAY MEALS

    const meals = await Nutrition.find({
      user: req.user.id,
      createdAt: { $gte: startOfDay },
    });

    // SLEEP

    const sleepLogs = await Sleep.find({
      user: req.user.id,
    }).sort({ createdAt: 1 });

    // HABITS

    const habits = await Habit.find({ user: req.user.id });

    // CALCULATIONS

    const waterTotal = waterLogs.reduce((sum, item) => sum + item.amount, 0);
    const caloriesTotal = meals.reduce((sum, item) => sum + item.calories, 0);
    const proteinTotal = meals.reduce((sum, item) => sum + item.protein, 0);
    const latestSleep =
      sleepLogs.length > 0
        ? sleepLogs[sleepLogs.length - 1].hours
        : 0;
    const completedHabits = habits.filter((h) => h.completed).length;

// TODAY SUMMARY ACTION

if (
  lowerPrompt.includes("how am i doing today") ||
  lowerPrompt.includes("today summary") ||
  lowerPrompt.includes("today status")
) {

  const waterGoal = 2500;
  const sleepGoal = 8;
  const proteinGoal = 80;
  const calorieGoal = 2000;

  const waterRemaining =
    Math.max(0, waterGoal - waterTotal);

  const proteinRemaining =
    Math.max(0, proteinGoal - proteinTotal);

  const calorieRemaining =
    Math.max(0, calorieGoal - caloriesTotal);

  let strongestArea = "Habit Tracking";

  if (waterTotal >= waterGoal)
    strongestArea = "Hydration";

  else if (latestSleep >= sleepGoal)
    strongestArea = "Sleep";

  else if (
    habits.length > 0 &&
    completedHabits / habits.length >= 0.7
  )
    strongestArea = "Habit Consistency";

  const reply = `
Today's Health Summary

Water Intake:
${waterTotal}/${waterGoal} ml

Sleep:
${latestSleep}/${sleepGoal} hours

Protein:
${proteinTotal}/${proteinGoal} g

Calories:
${caloriesTotal}/${calorieGoal}

Habits Completed:
${completedHabits}/${habits.length}

Your strongest area today is ${strongestArea}.

You still need ${waterRemaining} ml water, ${proteinRemaining} g protein and ${calorieRemaining} calories to reach today's targets.

Keep building consistency and focus on completing your remaining goals.
`;

  await AuroraChat.create({
    user: req.user.id,
    question: prompt,
    answer: reply,
  });

  return res.json({
    success: true,
    reply,
  });

}



    const result = await model.generateContent(`
You are Aurora AI.

You are an intelligent personal health coach.

Current User Information:

Name:
${user.name}

Age:
${user.age}

Gender:
${user.gender}

Height:
${user.height} cm

Weight:
${user.weight} kg

Current User Health Data:

Water Intake Today:
${waterTotal} ml

Latest Sleep:
${latestSleep} hours

Calories Today:
${caloriesTotal}

Protein Today:
${proteinTotal} g

Habits Completed:
${completedHabits}/${habits.length}

Rules:

- Give practical health advice.
- Keep response under 120 words.
- Use simple language.
- No markdown.
- No headings.
- No bullet symbols.
- Sound like a supportive human coach.
- Use the health data above whenever relevant.
- Mention missing goals if necessary.
- Focus on hydration, sleep, nutrition and habits.

User Question:
${prompt}
`);

    const reply =
      result.response.text() ||
      "Sorry, I could not generate a response.";

    await AuroraChat.create({
      user: req.user.id,
      question: prompt,
      answer: reply,
    });

    res.json({
      success: true,
      reply,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// GET CHAT HISTORY

exports.getChatHistory = async (req, res) => {
  try {

    const chats = await AuroraChat.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: chats,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};