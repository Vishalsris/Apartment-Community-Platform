const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, deleteUser, updateUserProfile, getUserStats } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.route('/stats')
  .get(protect, getUserStats);

router.route('/')
  .get(protect, adminOnly, getUsers);

router.route('/profile')
  .put(protect, updateUserProfile);

router.route('/:id')
  .put(protect, adminOnly, updateUserRole)
  .delete(protect, adminOnly, deleteUser);

module.exports = router;
