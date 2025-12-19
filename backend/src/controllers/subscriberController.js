const Subscriber = require('../models/Subscriber');

// @desc    Subscribe to newsletter
// @route   POST /api/subscribe
// @access  Public
const subscribeUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: 'Email is already subscribed' });
    }

    const subscriber = await Subscriber.create({ email });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to the newsletter!',
      data: subscriber
    });
  } catch (error) {
    if (error.code === 11000) {
       return res.status(400).json({ message: 'Email is already subscribed' });
    }
    console.error('Subscription error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  subscribeUser
};
