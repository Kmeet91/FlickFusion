import React from 'react';
import { Link } from 'react-router-dom';
import useUserStore from '../store/userStore';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { FaTimesCircle } from 'react-icons/fa';
import Footer from '../components/Footer';


const HistoryPage = () => {
    const { user, removeFromList } = useUserStore();
    const history = user?.history || [];

    const handleRemove = async (e, movieId) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await api.delete(`/users/history/${movieId}`);
            removeFromList('history', movieId);
        } catch (error) {
            console.error("Could not remove item from history:", error);
            alert("Could not remove item from history.");
        }
    };

    return (
        <div className='bg-[#141414] min-h-screen text-white'>
            <Navbar />
            <div className="pt-24 px-4 md:px-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">Watch History</h1>
                {history.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
                        {history.map(movie => (
                            <div key={movie.id}>
                                <div className="group relative">
                                    <Link to={`/details/${movie.media_type || 'movie'}/${movie.id}`}>
                                        <div className="aspect-[2/3] bg-neutral-800 rounded-md overflow-hidden transition-transform transform group-hover:scale-105">
                                            <img className="w-full h-full object-cover" src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title || movie.name} />
                                        </div>
                                    </Link>
                                    <button onClick={(e) => handleRemove(e, movie.id)} className="absolute top-2 right-2 text-white bg-black bg-opacity-60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove from history">
                                        <FaTimesCircle size={20} />
                                    </button>
                                </div>
                                <p className="mt-2 text-sm text-gray-200 truncate">{movie.title || movie.name}</p>
                            </div>
                        ))}
                    </div>
                ) : (<p>Your watch history is empty.</p>)}
            </div>
            <Footer />
        </div>
    );
};
export default HistoryPage;