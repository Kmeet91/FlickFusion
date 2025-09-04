import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import api from '../api/api';
import requests, { API_KEY } from '../api/requests';
// import useUserStore from '../store/userStore';
import Modal from 'react-modal';
import YouTube from 'react-youtube';
import Slider from "react-slick";
import { FaTimes, FaPlay, FaInfoCircle } from 'react-icons/fa';

// Import slick-carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

Modal.setAppElement('#root');

const Hero = () => {
    const [movies, setMovies] = useState([]);
    const [trailerKey, setTrailerKey] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    // const { user, addToList } = useUserStore();

    useEffect(() => {
        async function fetchData() {
            try {
                const request = await axios.get(requests.fetchTrending);
                setMovies(request.data.results.slice(0, 10));
            } catch (error) {
                console.error("Failed to fetch hero movies:", error);
            }
        }
        fetchData();
    }, []);

    const handlePlay = async (movie) => {
        if (!movie) return;
        try {
            // Save to history when play is clicked
            const itemToSave = { ...movie, media_type: movie.media_type || 'movie' };
            await api.post('/users/history', itemToSave);

            // Fetch trailer
            const response = await axios.get(`/${movie.media_type || 'movie'}/${movie.id}/videos?api_key=${API_KEY}`);
            const trailer = response.data.results.find(v => v.type === 'Trailer') || response.data.results.find(v => v.type === 'Teaser') || response.data.results[0];
            if (trailer) {
                setTrailerKey(trailer.key);
                setModalIsOpen(true);
            } else { alert("No trailer available for this title.") }
        } catch (error) {
            console.error("Error fetching trailer or saving history:", error);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setTrailerKey(null);
    };

    const truncate = (string, n) => string?.length > n ? string.substr(0, n - 1) + '...' : string;

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        fade: true,
        arrows: false,
    };

    // const handleAddToMyList = async (movie) => {
    //     if (movie) {
    //         try {
    //             await api.post('/users/watchlist', movie);
    //             addToList('watchlist', movie); // Update state
    //         } catch (error) {
    //             if (error.response?.status !== 400) {
    //                 alert("Could not add to list.");
    //             }
    //         }
    //     }
    // };

    // const checkInWatchlist = (movieId) => {
    //     return user?.watchlist?.some(item => item.id === movieId);
    // };
    return (
        <>
            <div className='w-full'>
                <Slider {...sliderSettings}>
                    {movies.map(movie => (
                        <div key={movie.id}>
                            <header
                                className="relative h-[560px] text-white"
                                style={{ backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`, backgroundSize: 'cover', backgroundPosition: 'center center' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
                                <div className="relative z-10 ml-8 md:ml-12 pt-56">
                                    <h1 className="text-4xl md:text-6xl font-extrabold pb-1">{movie?.title || movie?.name}</h1>
                                    <div className="my-4 flex items-center gap-4">
                                        <button onClick={() => handlePlay(movie)} className="bg-white text-black font-bold rounded px-6 py-2 hover:bg-opacity-80 transition flex items-center justify-center">
                                            <FaPlay className="mr-2" />
                                            <span>Play</span>
                                        </button>
                                        <Link
                                            to={`/details/${movie.media_type || 'movie'}/${movie.id}`}
                                            className="bg-gray-500 bg-opacity-50 text-white font-bold rounded px-6 py-2 hover:bg-opacity-30 transition flex items-center justify-center"
                                        >
                                            <FaInfoCircle className="mr-2" />
                                            <span>More Info</span>
                                        </Link>
                                    </div>
                                    <h2 className="w-full md:w-2/4 lg:w-1/3 text-sm md:text-base">{truncate(movie?.overview, 150)}</h2>
                                </div>
                            </header>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* --- MODAL WITH CLOSE BUTTON --- */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1000 },
                    content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '800px', backgroundColor: '#000', border: 'none', padding: '0', overflow: 'hidden' }
                }}
            >
                <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio Box */}
                    <button
                        onClick={closeModal}
                        className="absolute top-2 right-2 z-50 bg-black/30 text-white rounded-full p-2 hover:bg-black/60 transition"
                        aria-label="Close modal"
                    >
                        <FaTimes size={20} />
                    </button>
                    {trailerKey && (
                        <YouTube
                            videoId={trailerKey}
                            className="absolute top-0 left-0 w-full h-full"
                            opts={{
                                width: '100%',
                                height: '100%',
                                playerVars: { autoplay: 1 },
                            }}
                        />
                    )}
                </div>
            </Modal>
        </>
    );
};

export default Hero;