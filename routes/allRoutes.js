const express = require("express");

const router = express.Router();

const {
  auth,
} = require(
  "../middleware/authMiddleware"
);

const {
  addWater,
  getWaterLogs,
} = require("../controllers/waterController");

const {
  addSleep,
  getSleepLogs,
} = require("../controllers/sleepController");

const {
  addMeal,
  getMeals,
} = require("../controllers/nutritionController");

const habitRoutes = require("./habitRoutes");


const {getDashboard,} = require("../controllers/dashboardController");

const {askAurora,getChatHistory,} = require("../controllers/aiController");

const { register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
uploadProfilePhoto,
googleLogin,} = require("../controllers/authController");

const upload = require( "../middleware/uploadMiddleware" );

// ================= WATER =================

router.post("/water", auth,addWater);
router.get("/water",auth, getWaterLogs);

// ================= SLEEP =================

router.post("/sleep", auth, addSleep);
router.get("/sleep", auth, getSleepLogs);

// ================= NUTRITION =================

router.post("/nutrition", auth, addMeal);
router.get("/nutrition", auth, getMeals);

// ================= HABITS =================

router.use("/habits", habitRoutes);

// dashboard
router.get("/dashboard",auth, getDashboard);

// ai and chat history

router.post("/ai",auth, askAurora);
router.get("/ai/history",auth, getChatHistory);

// AUTH

router.post("/register",register);
router.post("/login",login);
router.post("/google-login",googleLogin);

router.get(
  "/profile",
  auth,
  getProfile
);

router.put(
  "/profile",
  auth,
  updateProfile
);

router.put(
  "/change-password",
  auth,
  changePassword
);

router.delete(
  "/delete-account",
  auth,
  deleteAccount
);


router.put(
  "/profile/photo",
  auth,
  upload.single("photo"),
  uploadProfilePhoto
);


module.exports = router;