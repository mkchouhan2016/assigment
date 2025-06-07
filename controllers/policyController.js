const path = require('path');
const fs = require('fs');
const { Worker } = require('worker_threads');
const Policy = require('../models/Policy');
const User = require('../models/User');
const logger = require('../logs/accessLogger');

exports.uploadCSV = (req, res) => {
  const file = req.files.file;

  if (!file) {
    logger.error('No file uploaded');
    return res.status(400).send({ error: 'No file uploaded' });
  }

  const uploadPath = path.join(__dirname, '../uploads', file.name);

  file.mv(uploadPath, (err) => {
    if (err) {
      logger.error('File move error:', err);
      return res.status(500).send(err);
    }

    logger.info(`File uploaded to ${uploadPath}`);

    const worker = new Worker(path.join(__dirname, '../workers/csvUploader.js'), {
      workerData: { filePath: uploadPath },
    });

    worker.on('message', (msg) => {
      logger.info(`Worker finished processing: ${msg}`);
      res.send({ message: msg });
    });

    worker.on('error', (err) => {
      logger.error('Worker thread error:', err);
      res.status(500).send(err);
    });

    worker.on('exit', (code) => {
      logger.info(`Worker exited with code ${code}`);
    });
  });
};

exports.searchPolicy = async (req, res) => {
  try {
    const username = req.params.username;
    logger.info(`Searching policies for user: ${username}`);

    const user = await User.findOne({ firstName: username });
    if (!user) {
      logger.warn(`User not found: ${username}`);
      return res.status(404).send({ error: 'User not found' });
    }

    const policies = await Policy.find({ userId: user._id });
    logger.info(`Found ${policies.length} policies for user: ${username}`);
    res.send(policies);
  } catch (err) {
    logger.error('Error in searchPolicy:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.aggregatePolicies = async (req, res) => {
  try {
    logger.info('Running policy aggregation');

    const result = await Policy.aggregate([
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          userName: '$user.firstName',
          policyCount: '$count',
        },
      },
    ]);

    logger.info(`Aggregation complete. Found ${result.length} users with policies.`);
    res.send(result);
  } catch (err) {
    logger.error('Error in aggregatePolicies:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
