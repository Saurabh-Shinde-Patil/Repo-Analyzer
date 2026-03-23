const UserPlan = require('../models/UserPlan');

// POST /api/subscribe
exports.subscribe = async (req, res, next) => {
  try {
    const { userId, planId, planName, price, currency } = req.body;

    if (!userId || !planId || !planName || price == null) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, planId, planName, price'
      });
    }

    // Upsert: update existing subscription or create new one
    const subscription = await UserPlan.findOneAndUpdate(
      { userId },
      {
        planId,
        planName,
        price,
        currency: currency || 'USD',
        status: 'active',
        subscribedAt: new Date()
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: `Successfully subscribed to ${planName}`,
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/subscribe/:userId
exports.getUserPlan = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const plan = await UserPlan.findOne({ userId, status: 'active' }).sort({ subscribedAt: -1 });

    if (!plan) {
      return res.status(200).json({
        success: true,
        data: { planId: 'free', planName: 'Free', price: 0, currency: 'USD' }
      });
    }

    res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    next(error);
  }
};
