const mongoose = require('mongoose');
const agentSchema = new mongoose.Schema({ name: String });
module.exports = mongoose.model('Agent', agentSchema);
