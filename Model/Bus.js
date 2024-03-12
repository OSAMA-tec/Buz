const mongoose=require('mongoose')
const busSchema = new mongoose.Schema({
  number: { type: String, unique: true },
  name: { type: String},
  logoUrl: { type: String},
  driverId:{type:String},
  type: { type: String, enum: ['rural', 'provincial', 'regional']},
  capacity: { type: Number },
  amenities: {
    tv: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    meals: { type: Boolean, default: false },
    AC: { type: Boolean, default: false },
  },
  delay: { type: String },
  delayReason:{type:String},
  arrivedLastStop:{type:String},
  arrivedNextStop:{type:String},
  seatsAvailable:{type:Number},
  avilable:{type:Boolean},
  routeId:{type:String}
});
const Bus = mongoose.model('Bus', busSchema);
module.exports={Bus}