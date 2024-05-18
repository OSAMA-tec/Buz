const { Bus } = require('../../../Model/Bus');
const { OwnerBus } = require('../../../Model/Owner');
const { Route } = require('../../../Model/route');
const { Location } = require('../../../Model/location');

const getAllBusesWithDetails = async (req, res) => {
    try {
        const buses = await Bus.find().exec();

        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You are not authorized to add bus owners' });
        }
        const busDetails = await Promise.all(buses.map(async (bus) => {
            const owner = await OwnerBus.findById(bus.ownerId).exec();
            const route = await Route.findById(bus.routeId).exec();
            const locations = await Location.find({ busId: bus._id }).exec();

            return {
                ...bus.toObject(),
                owner,
                route,
                locations,
            };
        }));

        res.status(200).json(busDetails);
    } catch (error) {
        console.error('Error fetching bus details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { getAllBusesWithDetails };
