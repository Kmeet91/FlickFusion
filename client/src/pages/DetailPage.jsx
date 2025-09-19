import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import api from '../api/api';
import useUserStore from '../store/userStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaPlay, FaStar, FaTimes, FaDownload } from 'react-icons/fa';
import { API_KEY } from '../api/requests';
import Modal from 'react-modal';
import YouTube from 'react-youtube';
import Loader from '../components/Loader';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

Modal.setAppElement('#root');

const DetailPage = () => {
    const { mediaType, id } = useParams();
    const [details, setDetails] = useState(null);
    const [credits, setCredits] = useState(null);
    const [videos, setVideos] = useState([]);
    const [images, setImages] = useState({ backdrops: [], posters: [] });
    const [recommendations, setRecommendations] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [providers, setProviders] = useState(null); // <-- State for watch providers
    const [tmdbReviews, setTmdbReviews] = useState([]);
    const [ourReviews, setOurReviews] = useState([]);
    const [reviewText, setReviewText] = useState("");
    const [expandedReviews, setExpandedReviews] = useState({});
    const [activeTab, setActiveTab] = useState('videos');
    const [trailerKey, setTrailerKey] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const { user, addToList } = useUserStore();

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            setDetails(null);
            const endpoints = [
                `/${mediaType}/${id}?api_key=${API_KEY}&language=en-US`,
                `/${mediaType}/${id}/credits?api_key=${API_KEY}&language=en-US`,
                `/${mediaType}/${id}/videos?api_key=${API_KEY}&language=en-US`,
                `/${mediaType}/${id}/images?api_key=${API_KEY}`,
                `/${mediaType}/${id}/recommendations?api_key=${API_KEY}&language=en-US`,
                `/${mediaType}/${id}/keywords?api_key=${API_KEY}`,
                `/${mediaType}/${id}/reviews?api_key=${API_KEY}&language=en-US`
            ];

            try {
                const ourReviewsRes = await api.get(`/reviews/${mediaType}/${id}`);
                // const providersRes = await api.get(`/tmdb/providers/${mediaType}/${id}`);
                const [detailsRes, creditsRes, videosRes, imagesRes, recommendationsRes, keywordsRes, tmdbReviewsRes] = await Promise.all(
                    endpoints.map(endpoint => axios.get(endpoint))
                );

                if (isMounted) {
                    setDetails(detailsRes.data);
                    setCredits(creditsRes.data);
                    // setProviders(providersRes.data.results); 
                    setVideos(videosRes.data.results);
                    setImages(imagesRes.data);
                    setRecommendations(recommendationsRes.data.results);
                    setKeywords(keywordsRes.data.keywords || keywordsRes.data.results);
                    setTmdbReviews(tmdbReviewsRes.data.results);
                    setOurReviews(ourReviewsRes.data);
                }
            } catch (error) { console.error("Failed to fetch details:", error) }
        };
        fetchData();
        return () => { isMounted = false };
    }, [mediaType, id]);

    const handlePlayTrailer = async (key) => {
        if (details) {
            try {
                const itemToSave = { ...details, media_type: mediaType };
                await api.post('/users/history', itemToSave);
            } catch (error) { console.error("Could not save to history:", error) }
        }
        if (key) {
            setTrailerKey(key);
            setModalIsOpen(true);
        } else {
            const trailer = videos.find(v => v.type === 'Trailer') || videos.find(v => v.type === 'Teaser') || videos[0];
            if (trailer) {
                setTrailerKey(trailer.key);
                setModalIsOpen(true);
            } else {
                alert("No video available to play.");
            }
        }
    };

    const handleAddToMyList = async () => {
        if (details) {
            const itemToAdd = { ...details, media_type: mediaType };
            try {
                await api.post('/users/watchlist', itemToAdd);
                addToList('watchlist', itemToAdd);
            } catch (error) {
                if (error.response?.status !== 400) alert("Could not add to list.");
            }
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewText.trim()) return;
        try {
            // --- UPDATED: Send mediaTitle and mediaPosterPath in the request body ---
            const res = await api.post('/reviews', {
                mediaType,
                mediaId: id,
                content: reviewText,
                mediaTitle: details.title || details.name, // Add the title
                mediaPosterPath: details.poster_path      // Add the poster path
            });

            setOurReviews([res.data, ...ourReviews]);
            setReviewText("");
        } catch (error) {
            alert(error.response?.data?.msg || "Failed to post review.");
        }
    };

    const closeModal = () => { setModalIsOpen(false); setTrailerKey(null) };

    const toggleReviewExpansion = (reviewId) => setExpandedReviews(prev => ({ ...prev, [reviewId]: !prev[reviewId] }));

    const getReviewerAvatar = (avatarPath) => {
        if (!avatarPath) return 'https://i.imgur.com/6VBx3io.png';
        if (avatarPath.startsWith('/https')) return avatarPath.substring(1);
        return `https://image.tmdb.org/t/p/w45/${avatarPath}`;
    };

    const getActorPlaceholder = (gender) => gender === 1 ? 'https://i.imgur.com/nqxRz4o.png' : 'https://i.imgur.com/6VBx3io.png';

    const isInWatchlist = user?.watchlist?.some(item => item.id.toString() === id);

    if (!details || !credits) {
        return <Loader />;    }

    const renderProviderList = (providerList) => (
        <div className="flex flex-wrap gap-4">
            {providerList.map(p => (
                <div key={p.provider_id} className="text-center" title={p.provider_name}>
                    <img src={`https://image.tmdb.org/t/p/w92/${p.logo_path}`} alt={p.provider_name} className="w-12 h-12 rounded-lg" />
                </div>
            ))}
        </div>
    );

    const handleDownloadMedia = async () => {
        if (!images.posters || !images.backdrops) {
            alert("No media available to download.");
            return;
        }

        alert("Preparing your download... this may take a moment.");

        const zip = new JSZip();
        const postersFolder = zip.folder('posters');
        const backdropsFolder = zip.folder('backdrops');

        const imageFetchPromises = [];

        // Add all posters to the zip
        images.posters.forEach((poster, index) => {
            const url = `https://image.tmdb.org/t/p/original${poster.file_path}`;
            const promise = fetch(url)
                .then(res => res.blob())
                .then(blob => {
                    postersFolder.file(`poster_${index + 1}.jpg`, blob);
                });
            imageFetchPromises.push(promise);
        });

        // Add all backdrops to the zip
        images.backdrops.forEach((backdrop, index) => {
            const url = `https://image.tmdb.org/t/p/original${backdrop.file_path}`;
            const promise = fetch(url)
                .then(res => res.blob())
                .then(blob => {
                    backdropsFolder.file(`backdrop_${index + 1}.jpg`, blob);
                });
            imageFetchPromises.push(promise);
        });

        try {
            await Promise.all(imageFetchPromises);
            const content = await zip.generateAsync({ type: 'blob' });
            const title = details.title || details.name;
            saveAs(content, `${title.replace(/ /g, '_')}_media.zip`);
        } catch (error) {
            console.error("Failed to create zip file:", error);
            alert("Sorry, the download could not be completed.");
        }
    };

    const watchLinks = providers?.IN || providers?.US;

    return (
        <div className="bg-[#141414] min-h-screen text-white">
            <Navbar />

            <div className="relative text-white" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${details.backdrop_path})`, backgroundSize: 'cover', backgroundPosition: 'center top' }}>
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row gap-8 items-center">
                    <img src={`https://image.tmdb.org/t/p/w500/${details.poster_path}`} alt={details.title || details.name} className="w-60 h-auto rounded-lg shadow-lg" />
                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl md:text-5xl font-bold">{details.title || details.name} <span className="font-light text-gray-300">({(details.release_date || details.first_air_date)?.substring(0, 4)})</span></h1>
                        <div className="flex items-center gap-4 my-4">
                            <button onClick={() => handlePlayTrailer()} className="flex items-center gap-2 font-semibold hover:text-gray-300 transition"><FaPlay /> Play Trailer</button>
                            <button onClick={handleAddToMyList} disabled={isInWatchlist} className={`font-semibold rounded px-4 py-2 transition flex items-center gap-2 ${isInWatchlist ? 'bg-green-600 cursor-not-allowed' : 'bg-gray-500 bg-opacity-50 hover:bg-opacity-30'}`}>{isInWatchlist ? '✓ Added' : '+ My List'}</button>
                            <button onClick={handleDownloadMedia} className="flex items-center gap-2 font-semibold hover:text-gray-300 transition"><FaDownload /> Download Media</button>
                            <div className="flex items-center gap-1"><FaStar className="text-yellow-400" /><span>{details.vote_average.toFixed(1)} / 10</span></div>
                        </div>
                        <p className="max-w-2xl">{details.overview}</p>
                    </div>
                </div>
            </div>

            <div className="p-8 md:p-16 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-3">
                    <h2 className="text-3xl font-bold mb-4">Top Billed Cast</h2>
                    <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                        {credits.cast.slice(0, 10).map(actor => (
                            <Link to={`/person/${actor.id}`} key={actor.id} className="bg-neutral-800 rounded-lg shadow-md flex-shrink-0 w-36 text-center hover:bg-neutral-700 transition">
                                <img src={actor.profile_path ? `https://image.tmdb.org/t/p/w200/${actor.profile_path}` : getActorPlaceholder(actor.gender)} alt={actor.name} className="rounded-t-lg w-full h-48 object-cover bg-neutral-700" />
                                <div className="p-2"><p className="font-bold text-sm">{actor.name}</p><p className="text-xs text-gray-400">{actor.character}</p></div>
                            </Link>
                        ))}
                        {watchLinks && (
                            <>
                                <h2 className="text-3xl font-bold mt-8 mb-4">Where to Watch</h2>
                                <div className="bg-neutral-800 p-4 rounded-lg">
                                    {watchLinks.flatrate && (
                                        <div>
                                            <h3 className="font-semibold mb-2">Streaming On:</h3>
                                            {renderProviderList(watchLinks.flatrate)}
                                        </div>
                                    )}
                                    {watchLinks.rent && (
                                        <div className="mt-4">
                                            <h3 className="font-semibold mb-2">Rent On:</h3>
                                            {renderProviderList(watchLinks.rent)}
                                        </div>
                                    )}
                                    {watchLinks.buy && (
                                        <div className="mt-4">
                                            <h3 className="font-semibold mb-2">Buy On:</h3>
                                            {renderProviderList(watchLinks.buy)}
                                        </div>
                                    )}
                                    <a href={watchLinks.link} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 mt-4 block">
                                        Provider data from JustWatch
                                    </a>
                                </div>
                            </>
                        )}
                    </div>

                    <h2 className="text-3xl font-bold mt-8 mb-4">Media</h2>
                    <div className="border-b border-neutral-700 mb-4">
                        <button onClick={() => setActiveTab('videos')} className={`py-2 px-4 font-semibold ${activeTab === 'videos' ? 'border-b-2 border-white' : 'text-gray-400'}`}>Videos ({videos.length})</button>
                        <button onClick={() => setActiveTab('backdrops')} className={`py-2 px-4 font-semibold ${activeTab === 'backdrops' ? 'border-b-2 border-white' : 'text-gray-400'}`}>Backdrops ({images.backdrops.length})</button>
                        <button onClick={() => setActiveTab('posters')} className={`py-2 px-4 font-semibold ${activeTab === 'posters' ? 'border-b-2 border-white' : 'text-gray-400'}`}>Posters ({images.posters.length})</button>
                    </div>
                    <div>
                        {activeTab === 'videos' && (<div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">{videos.map(video => (<div key={video.id} onClick={() => handlePlayTrailer(video.key)} className="flex-shrink-0 w-64 cursor-pointer"><img src={`https://img.youtube.com/vi/${video.key}/0.jpg`} alt={video.name} className="rounded-lg" /><p className="text-sm mt-2">{video.name}</p></div>))}</div>)}
                        {activeTab === 'backdrops' && (<div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">{images.backdrops.map((img, index) => (<img key={index} src={`https://image.tmdb.org/t/p/w500/${img.file_path}`} className="h-40 rounded-lg" />))}</div>)}
                        {activeTab === 'posters' && (<div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">{images.posters.map((img, index) => (<img key={index} src={`https://image.tmdb.org/t/p/w200/${img.file_path}`} className="h-60 rounded-lg" />))}</div>)}
                    </div>

                    <h2 className="text-3xl font-bold mt-8 mb-4">User Reviews</h2>
                    <div className="bg-neutral-800 p-4 rounded-lg mb-6"><form onSubmit={handleReviewSubmit}><textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="w-full bg-neutral-700 p-3 rounded-md" placeholder="Add your review..." rows="3"></textarea><button type="submit" className="bg-red-600 px-4 py-2 rounded-md mt-2 font-semibold hover:bg-red-700">Submit Review</button></form></div>
                    <div className="space-y-6">
                        {ourReviews.map(review => (<div key={review._id} className="bg-neutral-800 p-4 rounded-lg"><div className="flex items-center gap-4 mb-2"><img src={review.author.avatar.startsWith('http') ? review.author.avatar : `http://localhost:5000/api/image/${review.author.avatar}`} alt={review.author.username} className="w-10 h-10 rounded-full bg-neutral-700 object-cover" /><h3 className="font-semibold">{review.author.username} (Our User)</h3></div><p className="text-gray-300 text-sm">{review.content}</p></div>))}
                        {tmdbReviews.map(review => { const isExpanded = expandedReviews[review.id]; const isLongReview = review.content.length > 400; return (<div key={review.id} className="bg-neutral-800 p-4 rounded-lg"><div className="flex items-center gap-4 mb-2"><img src={getReviewerAvatar(review.author_details.avatar_path)} alt={review.author} className="w-10 h-10 rounded-full bg-neutral-700 object-cover" /><div><h3 className="font-semibold">{review.author}</h3>{review.author_details.rating && (<div className="flex items-center text-sm"><FaStar className="text-yellow-400 mr-1" /><span>{review.author_details.rating} / 10</span></div>)}</div></div><p className="text-gray-300 text-sm">{isExpanded ? review.content : review.content.substring(0, 400)}{isLongReview && !isExpanded && '...'}</p>{isLongReview && (<button onClick={() => toggleReviewExpansion(review.id)} className="text-sky-400 text-sm font-semibold mt-2">{isExpanded ? 'Show Less' : 'Read More'}</button>)}</div>); })}
                        {ourReviews.length === 0 && tmdbReviews.length === 0 && (<p className="text-gray-400">No reviews yet. Be the first to write one!</p>)}
                    </div>

                    <h2 className="text-3xl font-bold mt-8 mb-4">Recommendations</h2>
                    <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                        {recommendations.slice(0, 10).map(rec => (<Link to={`/details/${rec.media_type || mediaType}/${rec.id}`} key={rec.id} className="flex-shrink-0 w-40"><img src={`https://image.tmdb.org/t/p/w500/${rec.poster_path}`} alt={rec.title || rec.name} className="rounded-lg" /><p className="text-sm mt-2 truncate">{rec.title || rec.name}</p></Link>))}
                    </div>
                </div>

                <div className="md:col-span-1">
                    <h3 className="font-bold text-lg mb-2">Facts</h3>
                    <p><strong className="block">Status:</strong> {details.status}</p>
                    <p><strong className="block mt-2">Original Language:</strong> {details.original_language.toUpperCase()}</p>
                    <p><strong className="block mt-2">Network:</strong> {details.networks?.[0]?.name || 'N/A'}</p>
                    <h3 className="font-bold text-lg mt-6 mb-2">Keywords</h3>
                    <div className="flex flex-wrap gap-2">{keywords.map(kw => (<span key={kw.id} className="bg-neutral-700 text-sm px-2 py-1 rounded-md">{kw.name}</span>))}</div>
                </div>
            </div>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={{ overlay: { backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000 }, content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '800px', backgroundColor: '#000', border: 'none', padding: '0', overflow: 'hidden' } }}>
                <div className="relative pt-[56.25%]"><button onClick={closeModal} className="absolute top-2 right-2 z-50 bg-black/30 text-white rounded-full p-2 hover:bg-black/60 transition"><FaTimes size={20} /></button>{trailerKey && (<YouTube videoId={trailerKey} className="absolute top-0 left-0 w-full h-full" opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1 } }} />)}</div>
            </Modal>
            <Footer />
        </div>
    );
};

export default DetailPage;