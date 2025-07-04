const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Submission', submissionSchema);