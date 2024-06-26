const mongoose = require('mongoose')
const locationSchema = new mongoose.Schema({
    busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    latitude: { type: Number  },
    longitude: { type: Number },
    timestamp: { type: Date, default: Date.now },
  });

  const Location = mongoose.model('Location', locationSchema);
  module.exports = { Location }
