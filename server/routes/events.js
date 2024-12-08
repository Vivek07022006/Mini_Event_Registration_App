const express = require('express');
const { verifyToken, isAdmin } = require('../middleware/auth');
const Event = require('../models/Event');
const router = express.Router();

// Handler wrapper for DRY code
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Create Event (Admin only)
router.post(
  '/create',
  verifyToken,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { name, date, venue } = req.body;
    const event = new Event({ name, date, venue, createdBy: req.user.id });
    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });
  })
);

// Update Event (Admin only)
router.put(
  '/update/:id',
  verifyToken,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, date, venue } = req.body;
    const event = await Event.findByIdAndUpdate(
      id,
      { name, date, venue },
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event updated successfully', event });
  })
);

// Delete Event (Admin only)
router.delete(
  '/delete/:id',
  verifyToken,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  })
);

// Get All Events (Accessible to all authenticated users)
router.get(
  '/',
  verifyToken,
  asyncHandler(async (req, res) => {
    const events = await Event.find().populate('createdBy', 'name email');
    res.json(events);
  })
);

// Register for Event (Users only)
router.post(
  '/register/:id',
  verifyToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Check if the user is already registered
    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({ error: 'You have already registered for this event' });
    }

    // Add user to participants
    event.participants.push(req.user.id);
    await event.save();
    res.json({ message: 'Successfully registered for the event', event });
  })
);

module.exports = router;
