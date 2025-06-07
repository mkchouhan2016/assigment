// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const ScheduledMessage = require('../models/ScheduledMessage');

// Utility to convert day/time into a Date object
function parseDayTimeToDate(day, time) {
  const [hour, minute] = time.split(':').map(Number);
  const now = new Date();
  const target = new Date();

  // Set to desired time
  target.setHours(hour, minute, 0, 0);

  // Set to next desired day
  const dayIndex = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'].indexOf(day.toLowerCase());
  const currentDay = now.getDay();
  const diff = (dayIndex - currentDay + 7) % 7;
  if (diff !== 0 || target < now) target.setDate(now.getDate() + diff);

  return target;
}

router.post('/schedule', async (req, res) => {
  try {
    const { message, day, time } = req.body;
    if (!message || !day || !time) return res.status(400).send("Missing fields");

    const scheduledAt = parseDayTimeToDate(day, time);

    const newMessage = await ScheduledMessage.create({ message, scheduledAt });
    res.status(200).json({ message: 'Scheduled successfully', id: newMessage._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
