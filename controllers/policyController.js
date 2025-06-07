const path = require('path');
const fs = require('fs');
const { Worker } = require('worker_threads');
const Policy = require('../models/Policy');
const User = require('../models/User');

exports.uploadCSV = (req, res) => {
  const file = req.files.file;
  const uploadPath = path.join(__dirname, '../uploads', file.name);

  file.mv(uploadPath, (err) => {
    if (err) return res.status(500).send(err);

    const worker = new Worker(path.join(__dirname, '../workers/csvUploader.js'), {
      workerData: { filePath: uploadPath },
    });
    worker.on('message', (msg) => res.send({ message: msg }));
    worker.on('error', (err) => {
      console.log("res.status(50).send(err)", err);
      res.status(50).send(err)
    });
  });
};

exports.searchPolicy = async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ firstName: username });
  if (!user) return res.status(404).send({ error: 'User not found' });

  const policies = await Policy.find({ userId: user._id });
  res.send(policies);
};

exports.aggregatePolicies = async (req, res) => {
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
  res.send(result);
};