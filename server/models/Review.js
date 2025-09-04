import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    mediaId: { type: String, required: true },
    mediaType: { type: String, required: true },
    mediaTitle: { type: String }, // <-- Add this
    mediaPosterPath: { type: String }, // <-- Add this
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    // You can add a rating field later if you want
    // rating: { type: Number, min: 1, max: 10 }, 
}, { timestamps: true });

// Create a compound index to prevent a user from reviewing the same item twice
ReviewSchema.index({ mediaId: 1, author: 1 }, { unique: true });

export default mongoose.model('Review', ReviewSchema);