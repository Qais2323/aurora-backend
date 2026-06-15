const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      height,
      weight,
      waterGoal,
      bedTime,
      wakeUpTime,
    } = req.body;

    console.log(req.body);

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (!age || !gender || !height || !weight) {
      return res.status(400).json({
        success: false,
        message: "Age, Gender, Height and Weight are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      age: Number(age),
      gender,
      height: Number(height),
      weight: Number(weight),
      waterGoal: Number(waterGoal) || 2500,
      bedTime: bedTime || "22:00",
      wakeUpTime: wakeUpTime || "06:00",
      profileImage: "",
    });

    // ✅ SIRF YEH NAYA HAI — token generate karke response mein bheja
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        waterGoal: user.waterGoal,
        bedTime: user.bedTime,
        wakeUpTime: user.wakeUpTime,
        profileImage: user.profileImage,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        waterGoal: user.waterGoal,
        bedTime: user.bedTime,
        wakeUpTime: user.wakeUpTime,
        profileImage: user.profileImage,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      height,
      weight,
      waterGoal,
      bedTime,
      wakeUpTime,
      profileImage,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        age,
        gender,
        height,
        weight,
        waterGoal,
        bedTime,
        wakeUpTime,
        profileImage,
      },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    const valid = await bcrypt.compare(oldPassword, user.password);

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Old password incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({
      success: true,
      message: "Password updated",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({
      success: true,
      message: "Account deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPLOAD PROFILE PHOTO
exports.uploadProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const imageUrl = req.file.path;
    user.profileImage = imageUrl;
    await user.save();

    res.json({
      success: true,
      profileImage: imageUrl,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GOOGLE LOGIN
exports.googleLogin = async (req, res) => {
  try {
    const { email, name, picture, googleId } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      const hashedPassword = await bcrypt.hash("GOOGLE_LOGIN_USER", 10);
      user = await User.create({
        name,
        email,
        googleId,
        profileImage: picture,
        password: hashedPassword,
        age: 18,
        gender: "Other",
        height: 170,
        weight: 70,
        waterGoal: 2500,
        bedTime: "22:00",
        wakeUpTime: "06:00",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
