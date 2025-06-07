const mongoose = require('mongoose');
const accessLogger = require('./logs/accessLogger');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/policyDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    accessLogger.info(`MongoDB connected`);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
