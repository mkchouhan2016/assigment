const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');

router.post('/upload', policyController.uploadCSV);
router.get('/policy/search/:username', policyController.searchPolicy);
router.get('/policy/aggregate', policyController.aggregatePolicies);

module.exports = router;