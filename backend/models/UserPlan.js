const mongoose = require('mongoose');

const userPlanSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  planId: {
    type: String,
    required: true,
    enum: ['free', 'go', 'plus', 'pro', 'business']
  },
  planName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'INR'],
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserPlan', userPlanSchema);
