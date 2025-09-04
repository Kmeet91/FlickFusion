import User from '../models/User.js';
import Message from '../models/Message.js';
import Review from '../models/Review.js';

// --- User Management ---
export const getAllUsers = async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
};

export const updateUser = async (req, res) => {
    try {
        const { username, email, role } = req.body;
        const user = await User.findById(req.params.id);

        if (user) {
            user.username = username || user.username;
            user.email = email || user.email;
            user.role = role || user.role;
            await user.save();
            res.json({ msg: 'User updated' });
        } else {
            res.status(404).json({ msg: 'User not found' });
        }
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

export const deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
};

// --- Message Management ---
export const getAllMessages = async (req, res) => {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages);
};

export const deleteMessage = async (req, res) => {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Message deleted' });
};

// --- Review Management ---
export const getAllReviews = async (req, res) => {
    const reviews = await Review.find({}).populate('author', 'username').sort({ createdAt: -1 });
    res.json(reviews);
};

export const deleteReview = async (req, res) => {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Review deleted' });
};