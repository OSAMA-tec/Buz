// Queue/queue.js
require('dotenv').config();
const Queue = require('bull');
const sendEmail = require('../Notification-Wroker/sendEmail');

const emailQueue = new Queue('emailQueue', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
});

emailQueue.process(async (job, done) => {
  await sendEmail(job.data);
  done();
});

module.exports = emailQueue;