const { User } = require('../../../Model/User');
const { OwnerBus } = require('../../../Model/Owner');
const { Bus } = require('../../../Model/Bus');
const { Route } = require('../../../Model/route');
const { Location } = require('../../../Model/location');

const deleteOwner = async (req, res) => {
    try {
        const { ownerId } = req.body;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You are not authorized to delete bus owners' });
        }

        const ownerBus = await OwnerBus.findOne({ userId:ownerId });
        if (!ownerBus) {
            return res.status(404).json({ error: 'Bus owner not found' });
        }

        const owner = await User.findById(ownerBus.userId);
        if (!owner || owner.role !== 'owner') {
            return res.status(404).json({ error: 'User not found or not a bus owner' });
        }
        await User.findByIdAndDelete(owner._id);
        await OwnerBus.findByIdAndDelete(ownerBus._id);

        res.status(200).json({ message: 'Bus owner deleted successfully' });
    } catch (error) {
        console.error('Error deleting bus owner:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getOwner = async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'You are not authorized to retrieve bus owners' });
      }
  
      const ownerBuses = await OwnerBus.find().populate('userId');
  
      const ownerDetails = await Promise.all(ownerBuses.map(async (ownerBus) => {
        const buses = await Bus.find({ ownerId: ownerBus.ownerId });
        const busDetails = await Promise.all(buses.map(async (bus) => {
          const route = await Route.findById(bus.routeId);
          const locations = await Location.find({ busId: bus._id });
  
          return {
            ...bus.toObject(),
            route: route ? route.toObject() : null,
            locations: locations.map((location) => location.toObject()),
          };
        }));
  
        return {
          ...ownerBus.toObject(),
          user: ownerBus.userId ? ownerBus.userId.toObject() : null,
          buses: busDetails,
        };
      }));
  
      res.status(200).json({ message: 'Bus owner details retrieved successfully', ownerDetails });
    } catch (error) {
      console.error('Error retrieving bus owner details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
module.exports = { deleteOwner, getOwner };