// const mongoose = require('mongoose');

// const submissionSchema = new mongoose.Schema({
//   question: { type: String, required: true },
//   language: { type: String, required: true },
//   code: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Submission', submissionSchema);


const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  testCases: [{
    input: String,
    output: String,
    description: String,
    category: String,
    weightage: Number,
    visibility: String,
    isSample: Boolean,
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

module.exports = mongoose.model('Submission', submissionSchema);