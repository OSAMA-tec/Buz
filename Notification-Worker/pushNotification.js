const admin = require('../Firebase/config');
const axios = require('axios');
require('dotenv').config(); 


async function sendPushNotification(token, title, body) {
  try {
    const message = {
      to: token,
      notification: {
        title: title,
        body: body,
      },
    };

    const response = await axios.post('https://fcm.googleapis.com/fcm/send', message, {
      headers: {
        'Authorization': `key=${process.env.FIREBASE_SERVER_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      console.log('Push notification sent successfully');
    } else {
      console.error('Error sending push notification:', response.data);
      throw new Error('Failed to send push notification');
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
}

module.exports = { sendPushNotification };