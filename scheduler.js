// scheduler.js
const cron = require('node-cron');
const ScheduledMessage = require('./models/ScheduledMessage');

// Runs every minute to check if any message is due
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const dueMessages = await ScheduledMessage.find({
    scheduledAt: { $lte: now },
    status: 'pending',
  });

  for (const msg of dueMessages) {
    console.log(`[SENT] ${msg.message} @ ${msg.scheduledAt.toISOString()}`);
    msg.status = 'sent';
    await msg.save();
  }
});
