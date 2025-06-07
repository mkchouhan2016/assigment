// server.js
const express = require('express');
const fileUpload = require('express-fileupload');
const connectDB = require('./db');
const policyRoutes = require('./routes/policyRoutes');
const monitorAndRestartIfHigh = require('./cpuMonitor');
const messageRoutes = require('./routes/messageRoutes');
require('./scheduler'); // Import scheduler

const app = express();
connectDB();

app.use(express.json());
app.use(fileUpload());
app.use('/api', policyRoutes);
app.use('/api', messageRoutes);
const PORT = 9090;
monitorAndRestartIfHigh(70); // restart if CPU > 70%
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
