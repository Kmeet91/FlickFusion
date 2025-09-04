import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { API_KEY } from '../api/requests';

const Filters = ({ filters, onFilterChange }) => {
    const [genres, setGenres] = useState([]);

    // Fetch genres from TMDb when the media type changes
    useEffect(() => {
        async function fetchGenres() {
            try {
                const request = await axios.get(`/genre/${filters.mediaType}/list?api_key=${API_KEY}`);
                setGenres(request.data.genres);
            } catch (error) {
                console.error("Failed to fetch genres:", error);
            }
        }
        fetchGenres();
    }, [filters.mediaType]);

    const handleInputChange = (e) => {
        onFilterChange({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Media Type Filter */}
            <select name="mediaType" value={filters.mediaType} onChange={handleInputChange} className="bg-neutral-800 text-white p-2 rounded-md">
                <option value="movie">Movies</option>
                <option value="tv">TV Series</option>
            </select>

            {/* Genre Filter */}
            <select name="genre" value={filters.genre} onChange={handleInputChange} className="bg-neutral-800 text-white p-2 rounded-md">
                <option value="">All Genres</option>
                {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                ))}
            </select>

            {/* Year Filter */}
            <input 
                type="number" 
                name="year" 
                value={filters.year} 
                onChange={handleInputChange} 
                placeholder="Year of release" 
                className="bg-neutral-800 text-white p-2 rounded-md placeholder-neutral-400"
            />

            {/* Sort By Filter */}
            <select name="sortBy" value={filters.sortBy} onChange={handleInputChange} className="bg-neutral-800 text-white p-2 rounded-md">
                <option value="popularity.desc">Popularity</option>
                <option value="release_date.desc">Release Date</option>
                <option value="vote_average.desc">Rating</option>
            </select>
        </div>
    );
};

export default Filters;