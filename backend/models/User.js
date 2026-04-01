const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Resident', 'Admin'], default: 'Resident' },
  apartmentNumber: { type: String },
  phoneNumber: { type: String },
  avatarUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
