const mongoose = require('mongoose');

const marketplaceItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  condition: { type: String, required: true },
  imageUrl: { type: String }, // Assuming Cloudinary or simple URL
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Available', 'Sold'], default: 'Available' },
  approvalStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('MarketplaceItem', marketplaceItemSchema);
