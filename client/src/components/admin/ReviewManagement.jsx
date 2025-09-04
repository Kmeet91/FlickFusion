import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { FaTrash } from 'react-icons/fa';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const { data } = await api.get('/admin/reviews');
            setReviews(data);
        };
        fetchReviews();
    }, []);

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            await api.delete(`/admin/reviews/${reviewId}`);
            setReviews(reviews.filter(review => review._id !== reviewId));
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
            <div className="space-y-4">
                {reviews.map(review => (
                    <div key={review._id} className="bg-neutral-800 p-4 rounded-lg relative">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-sm text-gray-400">
                                    By: {review.author?.username || 'Unknown User'} on {review.mediaType} <span className="text-white">{review.mediaTitle}</span>
                                </p>
                                <p className="text-xs text-gray-500">Posted: {new Date(review.createdAt).toLocaleString()}</p>
                            </div>
                            <button onClick={() => handleDeleteReview(review._id)} className="text-red-500 hover:text-red-400">
                                <FaTrash />
                            </button>
                        </div>
                        <p className="mt-4 text-gray-300 italic">"{review.content}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewManagement;