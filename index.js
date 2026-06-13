const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const allRoutes = require("./routes/allRoutes");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// PROFILE IMAGES
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

app.use("/api", allRoutes);

app.get("/", (req, res) => {
  res.send("Aurora Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
