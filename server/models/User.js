import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: { type: String, required: true },
    avatar: { type: String, default: 'https://i.imgur.com/6VBx3io.png' }, // A neutral default avatar
    watchlist: [{ type: Object }],
    history: [{ type: Object }], // <-- ADD THIS LINE
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);