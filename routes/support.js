const express = require('express');
const router = express.Router();
const Support = require('../models/supportModel');

// POST - Save customer support query
router.post('/query', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const newQuery = new Support({ name, email, phone, message });
    await newQuery.save();

    res.status(201).json({ message: 'Support query submitted successfully.' });
  } catch (err) {
    console.error('Error saving query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ NEW: GET - Fetch all queries
router.get('/get', async (req, res) => {
  try {
    const queries = await Support.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    console.error('Error fetching queries:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
