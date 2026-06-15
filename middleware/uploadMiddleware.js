const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ── Cloudinary config ─────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Storage: seedha Cloudinary par upload hoga, disk pe nahi ─────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "aurora/profile-photos",   // Cloudinary mein folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 400, height: 400, crop: "fill", gravity: "face" }, // auto face-crop
      { quality: "auto" },             // size optimize
    ],
  },
});

const upload = multer({ storage });

module.exports = upload;