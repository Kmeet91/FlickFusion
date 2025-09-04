import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { API_KEY } from '../api/requests';
import Navbar from '../components/Navbar';
import Filters from '../components/Filters';
import Footer from '../components/Footer';
import AddToListButton from '../components/AddToListButton';
import Loader from '../components/Loader';


const DiscoverPage = () => {
    const [results, setResults] = useState([]);
    const [filters, setFilters] = useState({ mediaType: 'movie', genre: '', year: '', sortBy: 'popularity.desc' });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchDiscoverResults = useCallback(async (pageNum, isNewFilter) => {
        setLoading(true);
        let endpoint = `/discover/${filters.mediaType}?api_key=${API_KEY}&sort_by=${filters.sortBy}&page=${pageNum}`;
        if (filters.genre) endpoint += `&with_genres=${filters.genre}`;
        if (filters.year) endpoint += `&primary_release_year=${filters.year}`;
        try {
            const request = await axios.get(endpoint);
            setResults(prev => isNewFilter ? request.data.results : [...prev, ...request.data.results]);
            setTotalPages(request.data.total_pages);
        } catch (error) { console.error("Failed to fetch discover results:", error) }
        finally { setLoading(false) }
    }, [filters]);

    useEffect(() => {
        setPage(1);
        fetchDiscoverResults(1, true);
    }, [filters, fetchDiscoverResults]);

    const handleLoadMore = () => {
        const newPage = page + 1;
        if (newPage <= totalPages) {
            setPage(newPage);
            fetchDiscoverResults(newPage, false);
        }
    };

    return (
        <div className='bg-[#141414] min-h-screen text-white'>
            <Navbar />
            <div className="pt-24 px-4 md:px-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">Discover Titles</h1>
                <Filters filters={filters} onFilterChange={setFilters} />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
                    {results.map(item => item.poster_path && (
                        <div key={item.id}>
                            <div className="group relative">
                                <Link to={`/details/${filters.mediaType}/${item.id}`}>
                                    <div className="aspect-[2/3] bg-neutral-800 rounded-md overflow-hidden transition-transform transform group-hover:scale-105">
                                        <img className="w-full h-full object-cover" src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} alt={item.title || item.name} />
                                    </div>
                                </Link>
                                <AddToListButton movie={{ ...item, media_type: filters.mediaType }} />
                            </div>
                            <p className="mt-2 text-sm text-gray-200 truncate">{item.title || item.name}</p>
                        </div>
                    ))}
                </div>
                {loading && <Loader />}
                {page < totalPages && !loading && <div className="text-center mt-8"><button onClick={handleLoadMore} className="bg-red-600 px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition">Load More</button></div>}
            </div>
            <Footer />
        </div>
    );
};
export default DiscoverPage;