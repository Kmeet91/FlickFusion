import Review from '../models/Review.js';

// Get all reviews for a specific movie/show
export const getReviewsForMedia = async (req, res) => {
    try {
        const { mediaType, mediaId } = req.params;
        const reviews = await Review.find({ mediaType, mediaId })
            .populate('author', 'username avatar') // Get author's username and avatar
            .sort({ createdAt: -1 }); // Show newest reviews first
        res.json(reviews);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Add a new review
export const addReview = async (req, res) => {
    try {
        // Get all required data directly from the request body
        const { mediaType, mediaId, content, mediaTitle, mediaPosterPath } = req.body;

        const newReview = new Review({
            mediaType,
            mediaId,
            content,
            mediaTitle,       // Now coming from the frontend
            mediaPosterPath,  // Now coming from the frontend
            author: req.user.id
        });

        const review = await newReview.save();
        await review.populate('author', 'username avatar');

        res.status(201).json(review);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'You have already reviewed this title.' });
        }
        console.error("Error in addReview: - reviewController.js:39", err);
        res.status(500).send('Server Error');
    }
};