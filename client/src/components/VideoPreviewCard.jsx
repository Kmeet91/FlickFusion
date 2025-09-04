import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { API_KEY } from '../api/requests';
import YouTube from 'react-youtube';
import AddToListButton from './AddToListButton';

const VideoPreviewCard = ({ movie, isLargeRow, mediaType }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [trailerKey, setTrailerKey] = useState(null);
    const hoverTimeout = useRef(null);

    const fetchTrailer = async () => {
        try {
            const response = await axios.get(`/${mediaType}/${movie.id}/videos?api_key=${API_KEY}`);
            const trailer = response.data.results.find(v => v.type === 'Trailer') || response.data.results[0];
            if (trailer) {
                setTrailerKey(trailer.key);
            }
        } catch (error) {
            console.error("Error fetching trailer:", error);
        }
    };

    const handleMouseEnter = () => {
        // Wait 500ms before fetching the trailer to avoid accidental triggers
        hoverTimeout.current = setTimeout(() => {
            setIsHovered(true);
            fetchTrailer();
        }, 500);
    };

    const handleMouseLeave = () => {
        clearTimeout(hoverTimeout.current);
        setIsHovered(false);
        setTrailerKey(null);
    };

    const youtubeOpts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
            controls: 0,
            mute: 1,
            loop: 1,
            playlist: trailerKey, // Necessary for loop to work
        },
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`flex-shrink-0 mr-3 last:mr-0 ${isLargeRow ? 'w-40' : 'w-60'}`}
        >
            <div className="group relative transition-transform duration-300 transform hover:scale-110 hover:z-20">
                <Link to={`/details/${mediaType}/${movie.id}`}>
                    <div className={`rounded-md overflow-hidden bg-neutral-800 ${isLargeRow ? 'aspect-[2/3]' : 'aspect-video'}`}>
                        {isHovered && trailerKey ? (
                            <YouTube videoId={trailerKey} opts={youtubeOpts} className="w-full h-full" />
                        ) : (
                            <img
                                className="w-full h-full object-cover"
                                src={`https://image.tmdb.org/t/p/w500/${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                                alt={movie.name || movie.title}
                            />
                        )}
                    </div>
                </Link>
                {/* Only show the add button if not playing a video */}
                {!(isHovered && trailerKey) && <AddToListButton movie={{ ...movie, media_type: mediaType }} />}
            </div>
            <p className="mt-2 text-sm text-gray-200 truncate">{movie.title || movie.name}</p>
        </div>
    );
};

export default VideoPreviewCard;