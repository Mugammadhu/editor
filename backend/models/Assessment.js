const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, default: "basic" },
  weightage: { type: Number, default: 10 },
  visibility: { type: String, default: "open" },
  isSample: { type: Boolean, default: false },
});

const assessmentSchema = new mongoose.Schema({
  question: { type: String, required: true },
  language: {
    type: String,
    required: true,
    enum: ["python", "java", "cpp", "javascript"], // extend if needed
  },
  description: { type: String, required: true },
  evaluationMode: { type: String, enum: ["auto", "manual"], default: "auto" },
  timeLimit: { type: Number, default: 30 },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  testCases: [testCaseSchema], // Only relevant for auto evaluation
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

assessmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Assessment", assessmentSchema);
