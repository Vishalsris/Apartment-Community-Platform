const express = require('express');
const router = express.Router();
const { getComplaints, createComplaint, updateComplaint } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, getComplaints)
  .post(protect, createComplaint);

router.route('/:id')
  .put(protect, adminOnly, updateComplaint);

module.exports = router;
