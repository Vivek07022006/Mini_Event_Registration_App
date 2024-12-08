const mongoose = require('mongoose');

// Registration Schema
const registrationSchema = new mongoose.Schema(
  {
    eventId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Event', 
      required: true 
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    registeredAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Export Registration Model
module.exports = mongoose.model('Registration', registrationSchema);
