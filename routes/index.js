var express = require('express');
var router = express.Router();
const phoneController = require('../controllers/phoneController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// POST endpoint to receive phone number and additional info
router.post('/phone', async function(req, res, next) {
  const { phone, time, ip, deviceType } = req.body;

  if (!phone || !time || !ip || !deviceType) {
    return res.status(400).json({
      success: false,
      error: 'phone, time, ip, and deviceType are required.'
    });
  }

  try {
    const result = await phoneController.savePhoneData({
      phone,
      time,
      ip,
      deviceType
    });

    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(409).json(result); // 409 Conflict for duplicate entries
    }
  } catch (error) {
    console.error('Route error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;
