// // const express = require('express');
// // const router = express.Router();
// // const Submission = require('../models/Submission');
// // const handleOddEvenCheck = require('./eval/oddEven');

// // router.get('/', async (req, res) => {
// //   try {
// //     const data = await Submission.find().sort({ createdAt: -1 });
// //     res.json(data);
// //   } catch (err) {
// //     res.status(500).json({ error: 'Failed to fetch submissions' });
// //   }
// // });

// // // POST: Save a new submission
// // router.post('/', async (req, res) => {
// //   try {
// //     const { question, language, code } = req.body;
// //     const submission = new Submission({ question, language, code });
// //     await submission.save();
// //     const testResults = await handleOddEvenCheck({ question, language, code });

// //     res.status(201).json({ id: submission._id, testResults });
// //   } catch (error) {
// //     res.status(500).json({ error: 'Failed to save submission' });
// //   }
// // });

// // // GET: Retrieve a submission by ID
// // router.get('/:id', async (req, res) => {
// //   try {
// //     const submission = await Submission.findById(req.params.id);
// //     if (!submission) {
// //       return res.status(404).json({ error: 'Submission not found' });
// //     }
// //     res.json(submission);
// //   } catch (error) {
// //     res.status(500).json({ error: 'Failed to retrieve submission' });
// //   }
// // });

// // // PUT: Update a submission by ID
// // router.put('/:id', async (req, res) => {
// //   try {
// //     const { question, language, code } = req.body;
// //     const submission = await Submission.findByIdAndUpdate(
// //       req.params.id,
// //       { question, language, code, updatedAt: Date.now() },
// //       { new: true }
// //     );
// //     if (!submission) {
// //       return res.status(404).json({ error: 'Submission not found' });
// //     }
// //     res.json(submission);
// //   } catch (error) {
// //     res.status(500).json({ error: 'Failed to update submission' });
// //   }
// // });

// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const Submission = require("../models/Submission");
// const Assessment = require("../models/Assessment");
// const resolveHandler = require("./questionHandlers");

// router.get("/", async (req, res) => {
//   try {
//     const data = await Submission.find().sort({ createdAt: -1 });
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch submissions" });
//   }
// });

// router.post("/", async (req, res) => {
//   try {
//     const { question, language, code,testcases } = req.body;
//     const submission = new Submission({ question, language, code });
//     await submission.save();

//     const handler = resolveHandler(question);
//     if (!handler) {
//       return res.status(400).json({ error: "No matching handler found" });
//     }
//     const testResults = await handler({ question, language, code });
//     res.status(201).json({ id: submission._id, testResults });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to save submission" });
//   }
// });

// router.get("/:id", async (req, res) => {
//   try {
//     const submission = await Submission.findById(req.params.id);
//     if (!submission) {
//       return res.status(404).json({ error: "Submission not found" });
//     }
//     res.json(submission);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve submission" });
//   }
// });

// router.put("/:id", async (req, res) => {
//   try {
//     const { question, language, code } = req.body;
//     const submission = await Submission.findByIdAndUpdate(
//       req.params.id,
//       { question, language, code, updatedAt: Date.now() },
//       { new: true }
//     );
//     if (!submission) {
//       return res.status(404).json({ error: "Submission not found" });
//     }
//     res.json(submission);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update submission" });
//   }
// });

// router.post("/assessments", async (req, res) => {
//   try {
//     const {
//       question,
//       language,
//       description,
//       evaluationMode,
//       timeLimit,
//       difficulty,
//       testCases,
//     } = req.body;

//     const assessment = new Assessment({
//       question,
//       language,
//       description,
//       evaluationMode,
//       timeLimit,
//       difficulty,
//       testCases: evaluationMode === "auto" ? testCases : [],
//     });

//     await assessment.save();
//     res.status(201).json(assessment);
//   } catch (error) {
//     console.error("Failed to create assessment:", error);
//     res.status(500).json({ error: "Failed to create assessment" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Submission = require("../models/Submission");
const Assessment = require("../models/Assessment");
const resolveHandler = require("./questionHandlers");

router.get("/", async (req, res) => {
  try {
    const data = await Submission.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

router.post("/", async (req, res) => {

  try {
    const { question, language, code, testCases } = req.body;
    const submission = new Submission({ question, language, code, testCases });
    await submission.save();

    const handler = resolveHandler(question);
    if (!handler) {
      return res.status(400).json({ error: "No matching handler found" });
    }
    const testResults = await handler({ question, language, code, testCases });
    res.status(201).json({ id: submission._id, testResults });
  } catch (error) {
    res.status(500).json({ error: "Failed to save submission" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve submission" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { question, language, code, testCases } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { question, language, code, testCases, updatedAt: Date.now() },
      { new: true }
    );
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: "Failed to update submission" });
  }
});

router.post("/assessments", async (req, res) => {
  try {
    const {
      question,
      language,
      description,
      evaluationMode,
      timeLimit,
      difficulty,
      testCases,
    } = req.body;

    const assessment = new Assessment({
      question,
      language,
      description,
      evaluationMode,
      timeLimit,
      difficulty,
      testCases: evaluationMode === "auto" ? testCases : [],
    });

    await assessment.save();
    res.status(201).json(assessment);
  } catch (error) {
    console.error("Failed to create assessment:", error);
    res.status(500).json({ error: "Failed to create assessment" });
  }
});

module.exports = router;