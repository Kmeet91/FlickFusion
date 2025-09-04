import User from '../models/User.js';

const developerId = process.env.DEVELOPER_USER_ID;

export const getDeveloperInfo = async (req, res) => {
    try {
        if (!developerId) {
            return res.status(404).json({ msg: 'Developer ID not set in server.' });
        }

        const developer = await User.findById(developerId).select('username firstName lastName avatar');

        if (!developer) {
            return res.status(404).json({ msg: 'Developer profile not found.' });
        }

        res.json(developer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};