const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  repoUrl: {
    type: String,
    required: [true, 'Repository URL is required'],
  },
  owner: {
    type: String,
    required: true,
  },
  repo: {
    type: String,
    required: true,
  },
  m1: {
    type: String,
    required: true,
  },
  m2: {
    type: String,
    required: true,
  },
  m3: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;
