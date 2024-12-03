const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin reference
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // User references
});

module.exports = mongoose.model('Event', EventSchema);
