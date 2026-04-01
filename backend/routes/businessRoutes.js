const express = require('express');
const router = express.Router();
const { getBusinesses, createBusiness, updateBusinessStatus } = require('../controllers/businessController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, getBusinesses)
  .post(protect, createBusiness);

router.route('/:id/status')
  .put(protect, adminOnly, updateBusinessStatus);

module.exports = router;
