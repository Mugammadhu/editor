const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');

// POST: Save a new submission
router.post('/', async (req, res) => {
  try {
    const { question, language, code } = req.body;
    const submission = new Submission({ question, language, code });
    await submission.save();
    res.status(201).json({ id: submission._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save submission' });
  }
});

// GET: Retrieve a submission by ID
router.get('/:id', async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve submission' });
  }
});

// PUT: Update a submission by ID
router.put('/:id', async (req, res) => {
  try {
    const { question, language, code } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { question, language, code, updatedAt: Date.now() },
      { new: true }
    );
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update submission' });
  }
});

module.exports = router;