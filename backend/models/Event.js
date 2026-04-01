const mongoose = require('mongoose');

const pollOptionSchema = new mongoose.Schema({
  optionText: { type: String, required: true },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  image: { type: String, default: '' },
  totalAttendees: { type: Number, default: 0 },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  polls: [pollOptionSchema],
  rsvps: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    familyMembers: { type: Number, default: 0 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
