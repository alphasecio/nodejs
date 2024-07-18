const express = require('express');
const router = express.Router();

router.get('/api/data', (req, res) => {
    // Fetch data from database
    res.json({ message: 'Data fetched successfully' });
});

router.post('/api/data', (req, res) => {
    // Save data to database
    res.json({ message: 'Data saved successfully' });
});

module.exports = router;
