const { Notification } = require('../../Model/Notification');

const createNotification = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.user._id;

    let notification = await Notification.findOne({ userId });

    if (!notification) {
      notification = new Notification({
        userId,
        token,
      });
    } else {
      notification.token = token;
    }

    await notification.save();

    res.status(201).json({ message: 'Notification created successfully' });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notification = await Notification.findOne({ userId });

    if (!notification) {
      return res.status(404).json({ error: 'No notifications found' });
    }

    res.status(200).json(notification.notifications);
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateNotificationToken = async (req, res) => {
  try {
    const { allow } = req.body;
    const userId = req.user._id;

    const notification = await Notification.findOne({ userId });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (allow === false) {
      notification.token = undefined;
    } else if (allow === true) {
      const { token } = req.body;
      notification.token = token;
    } else {
      return res.status(400).json({ error: 'Invalid allow value' });
    }

    await notification.save();

    res.status(200).json({ message: 'Notification token updated successfully' });
  } catch (error) {
    console.error('Error updating notification token:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getAllNotifications,updateNotificationToken,createNotification };
