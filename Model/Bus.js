const mongoose=require('mongoose')
const busSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  type: { type: String, enum: ['rural', 'provincial', 'regional'], required: true },
  capacity: { type: Number, required: true },
  amenities: {
    tv: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    meals: { type: Boolean, default: false },
    // Add more amenities as needed
  },
  // Add more fields as needed
});
const Bus = mongoose.model('Bus', busSchema);
module.exports={Bus}