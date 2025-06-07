const mongoose = require('mongoose');
const policySchema = new mongoose.Schema({
  policyNumber: String,
  policyStartDate: String,
  policyEndDate: String,
  lobId: { type: mongoose.Schema.Types.ObjectId, ref: 'LOB' },
  carrierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
module.exports = mongoose.model('Policy', policySchema);