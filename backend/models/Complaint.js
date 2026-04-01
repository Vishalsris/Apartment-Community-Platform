const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // e.g. Maintenance, Noise, Security
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  proofImage: { type: String },
  resolutionNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
