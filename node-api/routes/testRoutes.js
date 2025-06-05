const express = require('express');

const router = express.Router();

router.route('/').get((req, res) => {
  res.status(200).json({
    title: 'Test Request',
    data: new Date().toLocaleString(),
  });
});

module.exports = router;
