const express = require('express');
const { verifyToken, isAdmin } = require('../middleware/auth');
const Event = require('../models/Event');
const router = express.Router();

// Create Event (Admin only)
router.post('/create', verifyToken, isAdmin, async (req, res) => {
  const { name, date, venue } = req.body;

  try {
    const event = new Event({ name, date, venue, createdBy: req.user.id });
    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (err) {
    res.status(500).json({ error: 'Error creating event' });
  }
});

// Update Event (Admin only)
router.put('/update/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, date, venue } = req.body;

  try {
    const event = await Event.findByIdAndUpdate(id, { name, date, venue }, { new: true });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event updated successfully', event });
  } catch (err) {
    res.status(500).json({ error: 'Error updating event' });
  }
});

// Delete Event (Admin only)
router.delete('/delete/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting event' });
  }
});

// Get All Events (Accessible to all)
router.get('/', verifyToken, async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching events' });
  }
});

// Register for Event (User only)
router.post('/register/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({ error: 'You have already registered for this event' });
    }

    event.participants.push(req.user.id);
    await event.save();
    res.json({ message: 'Successfully registered for the event', event });
  } catch (err) {
    res.status(500).json({ error: 'Error registering for the event' });
  }
});

module.exports = router;
