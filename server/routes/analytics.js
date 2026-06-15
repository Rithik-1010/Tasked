const express = require('express');
const router = express.Router();
const { getOverview, getProductivity, getStatusBreakdown } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/overview', getOverview);
router.get('/productivity', getProductivity);
router.get('/status', getStatusBreakdown);

module.exports = router;
