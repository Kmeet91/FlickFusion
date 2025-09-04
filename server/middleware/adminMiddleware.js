import User from '../models/User.js';

const adminMiddleware = async (req, res, next) => {
    try {
        // req.user.id is from the preceding authMiddleware
        const user = await User.findById(req.user.id);

        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ msg: 'Forbidden: Admin access required.' });
        }
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

export default adminMiddleware;