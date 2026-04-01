const express = require('express');
const router = express.Router();
const { 
  getMarketplaceItems, 
  createMarketplaceItem, 
  updateMarketplaceItemStatus,
  updateMarketplaceItemApprovalStatus 
} = require('../controllers/marketplaceController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, getMarketplaceItems)
  .post(protect, createMarketplaceItem);

router.route('/:id/status')
  .put(protect, updateMarketplaceItemStatus);

router.route('/:id/approval-status')
  .put(protect, adminOnly, updateMarketplaceItemApprovalStatus);

module.exports = router;
