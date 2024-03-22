const mongoose = require('mongoose');

const ownerBusSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  companyName: {
    type: String,
  },
  companyLocation: {
    type: String,
  },
  numberOfBuses: {
    type: Number,
    default: 0
  },
  contactPerson: {
    name: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
    }
  },
  registrationNumber: {
    type: String,
    unique: true
  },
  establishedYear: {
    type: Number,
  },
  operatingRoutes: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  ownerId: {
    type: String,
  }
});

const OwnerBus = mongoose.model('OwnerBus', ownerBusSchema);

module.exports = {OwnerBus};