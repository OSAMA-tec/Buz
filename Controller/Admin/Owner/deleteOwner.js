const { User } = require('../../../Model/User');
const { OwnerBus } = require('../../../Model/Owner');

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
            return res.status(403).json({ error: 'You are not authorized to delete bus owners' });
        }

        const ownerBus = await OwnerBus.find();
        if (!ownerBus) {
            return res.status(404).json({ error: 'Bus owner not found' });
        }


        res.status(200).json({ message: 'Bus owner get successfully', ownerBus });
    } catch (error) {
        console.error('Error deleting bus owner:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { deleteOwner, getOwner };