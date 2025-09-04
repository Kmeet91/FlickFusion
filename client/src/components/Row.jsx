import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { FaChevronRight } from 'react-icons/fa';
import AddToListButton from './AddToListButton';
import VideoPreviewCard from './VideoPreviewCard';

const Row = ({ title, fetchUrl, movies: moviesProp, categoryKey, isLargeRow = false, mediaType = 'movie' }) => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        if (moviesProp)
            setMovies(moviesProp);
        else
        {
            async function fetchData() {
                const request = await axios.get(fetchUrl);
                setMovies(request.data.results);
            }
            fetchData();
        }
    }, [fetchUrl, moviesProp]);

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-white text-xl md:text-2xl font-semibold">{title}</h2>
                <Link to={`/category/${categoryKey}?mediaType=${mediaType}`} className="flex items-center ...">
                    Explore All <FaChevronRight className="ml-1" />
                </Link>
            </div>

            <div className="flex overflow-y-hidden overflow-x-scroll p-4 -ml-4 scrollbar-hide">
                {movies.map(movie =>
                    (movie.poster_path && movie.backdrop_path) && (
                        // Use the movie's own media_type if it exists, otherwise use the row's default
                        <VideoPreviewCard
                            key={movie.id}
                            movie={movie}
                            isLargeRow={isLargeRow}
                            mediaType={movie.media_type || mediaType}
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default Row;