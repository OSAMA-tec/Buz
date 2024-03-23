const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: String},
  notifications: [
    {
      title: { type: String},
      body: { type: String },
      type: { type: String },
      status: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  token: { type: String }
});

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = { Notification };