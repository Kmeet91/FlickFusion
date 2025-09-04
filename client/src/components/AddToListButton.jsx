import React from 'react';
import useUserStore from '../store/userStore';
import api from '../api/api';
import { FaPlusCircle, FaCheckCircle } from 'react-icons/fa';

const AddToListButton = ({ movie }) => {
    const { user, addToList } = useUserStore();

    // Check if the movie is already in the user's watchlist
    const isInWatchlist = user?.watchlist?.some(item => item.id === movie.id);

    const handleAdd = async (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent parent Link navigation

        try {
            await api.post('/users/watchlist', movie);
            addToList('watchlist', movie); // Update state instantly
        } catch (error) {
            // Alert user only if it's not a 'duplicate' error (status 400)
            if (error.response?.status !== 400) {
                alert("Could not add to list.");
            }
            console.error("Error adding to list:", error);
        }
    };

    return (
        <>
            {isInWatchlist ? (
                // If in the list, show a VISIBLE checkmark.
                <div
                    className="absolute top-2 right-2 text-green-400 bg-black bg-opacity-70 rounded-full p-1 z-10"
                    title="In your list"
                >
                    <FaCheckCircle size={20} />
                </div>
            ) : (
                // Otherwise, show the add button that appears on hover.
                <button
                    onClick={handleAdd}
                    className="absolute top-2 right-2 text-white bg-black bg-opacity-70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Add to My List"
                >
                    <FaPlusCircle size={20} />
                </button>
            )}
        </>
    );
};

export default AddToListButton;