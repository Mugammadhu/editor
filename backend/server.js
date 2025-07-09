const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const submissionRoutes = require("./routes/submissions");

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    // origin: [process.env.PARENT_URI, process.env.CHILD_URI], // Allow parent and child origins
    origin: [
      "https://digi-exams.netlify.app",
      "https://instantcoder.netlify.app",
    ], // Allow parent and child origins
  })
);
app.use(express.json());

// Routes
app.use("/api/submissions", submissionRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
